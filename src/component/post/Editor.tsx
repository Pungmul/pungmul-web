"use client";
import "draft-js/dist/Draft.css"; // 기본 스타일 적용
import React, { useCallback, useEffect, useRef, useState } from "react";
import { set, throttle } from "lodash";
import { EditorState, Editor, convertFromRaw } from "draft-js";

import {
  patchContextRequest,
  postContextRequest,
} from "../../api/post/postContextRequest";
import { loadPostFetch } from "@pThunder/api/post/loadPostFetch";
import checkMark from "@public/icons/checkMark.svg";
import { Header } from "@pThunder/component/shared/Header";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: [],
      depth: 0,
      inlineStyleRanges: [],
    },
  ],
});
const DraftEditor: React.FC<{ boardID: number }> = ({ boardID }) => {
  const router = useRouter();
  const query = useSearchParams();
  const postId = query.get("postId") as number | null;
  const isEdit = postId !== null;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(emptyContentState)
  );
  const [title, setTitle] = useState("");

  const [hasScroll, setHasScroll] = useState(false);
  const [anonymity, setAnonymity] = useState(true);
  const [imageFiles, setImageFiles] = useState<{ id?: number; blob: Blob }[]>(
    []
  );
  const [prevImageIdList, setPrevImageIdList] = useState<number[]>([]);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (isEdit && !!postId) {
      setIsLoading(true);
      const loadPost = async () => {
        try {
          setIsLoading(true);
          setIsError(false);
          const res = await loadPostFetch({ postId });

          console.log("res", res);
          if (!res) {
            throw new Error("게시물 로드 실패");
          }

          const { title, content, author, imageList, isWriter } = res;

          if (!isWriter) {
            alert("작성자만 수정할 수 있습니다.");
            router.replace(`/board/${boardID}`);
          }
          const anonymity = author === "Anonymous";

          const files = await Promise.all(
            imageList.map(async (image) => {
              const res = await fetch(`/image/api?url=${image.fullFilePath}`);
              const blob = await res.blob(); // 진짜 Blob으로 변환
              return { blob, id: image.id };
            })
          );

          setTitle(title);

          setEditorState(
            EditorState.createWithContent(
              convertFromRaw({
                entityMap: {},
                blocks: [
                  {
                    text: content,
                    key: "foo",
                    type: "unstyled",
                    entityRanges: [],
                    depth: 0,
                    inlineStyleRanges: [],
                  },
                ],
              })
            )
          );
          setAnonymity(anonymity);
          if (files.length > 0) {
            setImageFiles(files);
            setPrevImageIdList(files.map((file) => file.id as number));
          }
          console.log("완료");
        } catch (e) {
          console.error(e);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };
      loadPost();
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [postId]);

  // 스크롤 여부를 감지하는 함수
  const checkForScroll = useCallback(() => {
    if (scrollableRef.current) {
      console.log("called");
      setHasScroll(
        scrollableRef.current.scrollHeight > scrollableRef.current.clientHeight
      );
    }
  }, [scrollableRef]);

  const checkForScrollThrottled = throttle(() => checkForScroll(), 5000);

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
    checkForScrollThrottled();
  };

  const handlePosting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = editorState.getCurrentContent().getPlainText();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("Title") as string;
    if (text.length == 0 || text.length == 0) {
      console.log("write down something!");
      return;
    }
    const userForm = new FormData();

    const changedImageFiles = imageFiles.filter((file) => {
      return file.id === undefined;
    });
    console.log(
      "changedImageFiles",
      changedImageFiles,
      changedImageFiles.length
    );

    if (changedImageFiles && changedImageFiles.length > 0) {
      Array.from(changedImageFiles).forEach((file) => {
        userForm.append("files", file.blob);
      });
    } else {
      userForm.append("files", new Blob()); // 빈 파일 추가
    }

    try {
      if (isEdit && !!postId) {
        const deleteImageIdList = prevImageIdList.filter(
          (id) => !imageFiles.some((file) => file.id === id)
        );

        console.log("deleteImageIdList", deleteImageIdList);

        const postBlob = new Blob(
          [JSON.stringify({ title, text, anonymity, deleteImageIdList })],
          {
            type: "application/json",
          }
        );

        userForm.append("postData", postBlob);

        await patchContextRequest({
          postId,
          boardId: boardID,
          formData: userForm,
        });

        router.back();
      } else {
        const postBlob = new Blob(
          [JSON.stringify({ title, text, anonymity })],
          {
            type: "application/json",
          }
        );

        userForm.append("postData", postBlob);
        const { postId: createdPostId } = await postContextRequest({
          boardId: boardID,
          formData: userForm,
        });
        router.replace(`/board/${boardID}?postId=${createdPostId}`);
      }
    } catch (e) {
      console.error(e);
      if (isEdit) {
        alert("게시물 수정에 실패했습니다.");
      } else {
        alert("게시물 작성에 실패했습니다.");
      }
    }
  };

  if (editorState === undefined || editorRef.current === undefined)
    return notFound();
  return (
    <>
      <form
        className="h-full overflow-y-auto flex flex-col"
        onSubmit={handlePosting}
      >
        <Header
          title={"글쓰기"}
          onLeftClick={() => {
            if (isEdit) {
              router.replace(`/board/${boardID}?postId=${postId}`);
            } else {
              router.replace(`/board/${boardID}`);
            }
          }}
          rightBtn={
            title?.length > 0 &&
            editorState.getCurrentContent().getPlainText().length > 0 ? (
              <button
                type="submit"
                className="text-center text-gray-500 cursor-pointer w-8 "
              >
                저장
              </button>
            ) : (
              <div className="text-center text-gray-300 w-8 ">저장</div>
            )
          }
        />
        <div className="my-4 min-h-60 w-full flex px-4 flex-col flex-grow">
          <input
            type="text"
            name="Title"
            id="Title"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 outline-none border-b border-b-gray-300 placeholder-gray-300 font-medium text-xl pb-0.5 mb-2 break-words w-full"
          />
          <div
            ref={scrollableRef}
            onClick={() => {
              editorRef.current?.focus();
            }}
            className={`flex-grow overflow-y-auto flex flex-col ${
              hasScroll ? "pl-4 pr-1" : "px-2"
            }`}
          >
            <div className="flex flex-col">
              <div className="min-h-32">
                <Editor
                  ref={editorRef}
                  editorState={editorState}
                  placeholder="내용을 작성하세요"
                  onChange={handleEditorChange}
                />
              </div>
              {imageFiles.length > 0 && (
                <div
                  className="flex flex-row gap-2 overflow-x-auto items-center"
                  style={{ height: 160 }}
                >
                  {imageFiles.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file.blob);

                    return (
                      <div
                        key={"첨부 이미지" + index}
                        className="relative overflow-visible"
                      >
                        <Image
                          src={imageUrl}
                          alt="이미지"
                          width={120}
                          height={120}
                          style={{
                            objectFit: "cover",
                            width: 120,
                            height: 120,
                          }}
                        ></Image>
                        <div
                          className="absolute cursor-pointer -top-2 -right-2 w-6 h-6 bg-black rounded-full text-white items-center justify-center flex"
                          onClick={() => {
                            setImageFiles((prev) =>
                              prev?.filter((_, i) => index !== i)
                            );
                          }}
                        >
                          x
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <span className="text-[#b2b2b2] text-right font-light">
                {editorState.getCurrentContent().getPlainText().length}
              </span>
              <br />
              {editorState.getCurrentContent().getBlockMap().size < 5 &&
                editorState.getCurrentContent().getPlainText().length < 200 &&
                imageFiles.length == 0 && (
                  <div className="bottom-32 select-none">
                    <div
                      className="text-left relative"
                      style={{ color: "#b2b2b2" }}
                    >
                      <div>
                        <div>
                          <div style={{ fontSize: 16 }} className="font-medium">
                            게시글 작성 안내
                          </div>
                          <div style={{ fontSize: 13 }} className="font-light">
                            게시판 이용 시 아래 내용을 반드시 숙지해 주시기
                            바랍니다.
                          </div>
                        </div>
                        <br />
                        <ol className="list-decimal pl-6 font-medium">
                          <li>
                            피해 발생 시 책임
                            <div
                              style={{ fontSize: 13 }}
                              className="font-light"
                            >
                              게시판에 게시된 글로 인해 발생하는 피해는 글
                              작성자 본인에게 책임이 있습니다. 글 작성 시 신중히
                              작성해 주시기 바랍니다.
                            </div>
                            <br />
                          </li>
                          <li>
                            명예훼손 및 불법 행위 금지
                            <div
                              style={{ fontSize: 13 }}
                              className="font-light"
                            >
                              타인의 명예를 훼손하거나 법적으로 문제가 될 수
                              있는 내용을 포함한 게시글은 엄격히 금지됩니다.
                              해당 글은 사전 통보 없이 삭제될 수 있으며, 필요한
                              경우 법적 조치를 취할 수 있습니다.
                            </div>
                            <br />
                          </li>
                          <li>
                            개인정보 보호
                            <div
                              style={{ fontSize: 13 }}
                              className="font-light"
                            >
                              게시글에 개인 정보(연락처, 주소 등)를 포함하지
                              않도록 주의해 주시기 바랍니다.
                            </div>
                            <br />
                          </li>
                          <li>
                            문의 및 신고
                            <div
                              style={{ fontSize: 13 }}
                              className="font-light"
                            >
                              게시판 이용과 관련하여 궁금한 사항이 있거나 문제를
                              발견하신 경우, 관리자에게 문의해 주시기 바랍니다.
                            </div>
                            <br />
                          </li>
                        </ol>

                        <div style={{ fontSize: 13 }} className="font-light">
                          이용자 여러분의 협조를 부탁드립니다.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              <br />
            </div>
          </div>
          <div className="flex flex-row w-full items-center justify-between bottom-0 px-4 z-10">
            <div className="flex">
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files !== null && e.target.files.length > 0) {
                    setImageFiles((prevFiles) => {
                      if (e.target.files !== null) {
                        return [...prevFiles, { blob: e.target.files[0] }];
                      }
                      return [...prevFiles];
                    });
                  }
                }}
              />
              <label htmlFor="images">
                <div className="cursor-pointer">사진 첨부</div>
              </label>
            </div>

            <label className="flex flex-row gap-2 items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                name="anonymity"
                id="anonymity"
                className="hidden peer"
              />
              <div
                className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                style={{ backgroundColor: "#816DFF" }}
              >
                <Image src={checkMark} width={12} alt="" />
              </div>
              <div className="block w-5 h-5 bg-white border border-gray-300 peer-checked:hidden rounded-sm" />
              <div
                style={{ fontSize: 12 }}
                className="text-gray-400 peer-checked:text-black"
              >
                익명 작성
              </div>
              {/* <input type="checkbox" className='hidden' name="anonymity" id="anonymity" checked={anonymity} onChange={(e) => setAnonymity(e.currentTarget.checked)} />
                            <div className={`w-3 h-3 border rounded-sm ${anonymity ? 'bg-gray-500' : 'bg-white'}`} />
                            <div className='text-xs'>익명 작성</div> */}
            </label>
          </div>
        </div>
      </form>
    </>
  );
};

export default DraftEditor;
