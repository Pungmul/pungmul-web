'use client'
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, Editor as EditorComponent } from 'draft-js';
import 'draft-js/dist/Draft.css'; // 기본 스타일 적용
import { throttle } from 'lodash';
import { Header } from '@pThunder/app/component/header';

import postContext from './utils';

const Editor = dynamic(() => import('draft-js').then(mod => mod.Editor), { ssr: false });

const DraftEditor: React.FC<{ boardID: number }> = ({ boardID }) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [hasScroll, setHasScroll] = useState(false);
    const [anonymity, setAnonymity] = useState(true)
    const [imageFiles, setImageFiles] = useState<Blob[] | null>(null)
    const scrollableRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<EditorComponent | null>(null)

    // 스크롤 여부를 감지하는 함수
    const checkForScroll = useCallback(() => {
        if (scrollableRef.current) {
            console.log('called')
            setHasScroll(scrollableRef.current.scrollHeight > scrollableRef.current.clientHeight);
        }
    }, [scrollableRef]);
    const checkForScrollThrottled = throttle(() => checkForScroll(), 5000);
    const handleEditorChange = (newState: EditorState) => {
        setEditorState(newState);
        checkForScrollThrottled();
    };

    const handlePosting = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const text = editorState.getCurrentContent().getPlainText();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('Title') as string;
        if (text.length == 0 || text.length == 0) { console.log('write down something!'); return }
        console.log({ title, text, anonymity })

        const userForm = new FormData();

        if (imageFiles && imageFiles.length > 0) {
            Array.from(imageFiles).forEach(file => {
                userForm.append('files', file);
            });
        }else {
            userForm.append('files', new Blob()); // 빈 파일 추가
        }

        const postBlob = new Blob([JSON.stringify({ title, text, anonymity })], {
            type: 'application/json'
        });

        userForm.append('postData', postBlob);

        postContext(boardID, userForm);
    }

    return (
        <>

            <form className='h-full overflow-y-auto' onSubmit={handlePosting} >
                <Header title={'글쓰기'} rightBtn={<button type='submit' className='text-center text-gray-500 cursor-pointer w-8 '>
                    저장
                </button>} />
                <div className='my-4 min-h-60 w-full flex flex-col flex-grow'>
                    <input type="text" name="Title" id="Title" placeholder='제목을 입력하세요' className='mx-4 outline-none border-b border-b-gray-300 font-medium text-xl pb-0.5 mb-2' />
                    <div ref={scrollableRef}
                        className={`flex-grow overflow-y-auto ${hasScroll ? 'pl-4 pr-1' : 'px-4'}`}
                    >
                        <Editor

                            editorState={editorState}
                            placeholder="글을 작성하세요"
                            onChange={handleEditorChange}
                        />
                    </div>
                    <div className='flex flex-row w-full items-center justify-between bottom-0 px-4 z-10'>
                        <label className='flex flex-row gap-1 items-center'>
                            <input type="checkbox" className='hidden' name="anonymity" id="anonymity" checked={anonymity} onChange={(e) => setAnonymity(e.currentTarget.checked)} />
                            <div className={`w-3 h-3 border rounded-sm ${anonymity ? 'bg-gray-500' : 'bg-white'}`} />
                            <div className='text-xs'>익명 작성</div>
                        </label>

                    </div>
                </div>
            </form>
        </>
    );
};

export default DraftEditor;