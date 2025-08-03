'use client'

import Modal from '@pThunder/shared/components/ui/Modal';
import { throttle } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'

interface CommentMenuProps {
    commentId: number
    commentContent: string
    commentWriter: string
}

function CommentMenu({ commentId, commentContent, commentWriter }: CommentMenuProps) {
    const [isOpen, setOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isBelowHalf, setIsBelowHalf] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (isOpen)
          if (
            targetRef.current &&
            !targetRef.current.contains(e.target as Node)
          ) {
            setOpen(false);
          }
      };
  
      if (isOpen) {
        document.addEventListener("mousedown", handleClick);
      }
  
      return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen]);

    const handleReportClick = () => {
        setModalOpen(true);  // 신고 클릭 시 모달 열기
        setOpen(false);  // 메뉴 닫기
        setSelectedOption(null);
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.currentTarget.id);
        console.log(event.currentTarget.id)
    };

    const checkPosition =
        throttle(() => {

            if (!targetRef.current) return;

            const rect = targetRef.current.getBoundingClientRect();

            if ((rect.bottom < 0 || rect.top > window.innerHeight)) {
                setOpen(false);
                return
            };

            const viewportMiddle = window.innerHeight / 3 * 2;
            const isBelow = rect.top > viewportMiddle;

            setIsBelowHalf(isBelow);
            
        }, 1000)

    useEffect(() => {

        window.addEventListener("scroll", checkPosition, { passive: true, capture: true }); // ⚡ 성능 최적화

        return () => {
            window.removeEventListener("scroll", checkPosition);
        };

    }, [checkPosition]);


    return (
        <>
            <div ref={targetRef}
                className={'relative select-none cursor-pointer w-full h-full'}
                onClick={() => { setOpen(prev => !prev) }}>
                {(commentId === 552 ? '이거' : '')}
                {isOpen &&
                    <ul className={`absolute right-0 px-3 py-2 border bg-white rounded-sm flex flex-col gap-2 ${isBelowHalf ? ' -top-[112px] mb-1' : ' top-full mt-1'}`}
                        onClick={(e) => { e.stopPropagation() }}>
                        <li className='w-12 text-right'>수정</li>
                        <li className='w-12 text-right' onClick={handleReportClick}>신고</li>
                        <li className='w-12 text-right text-red-400'>삭제</li>
                    </ul>
                }
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setModalOpen(false) }} title='댓글 신고하기'>
                <form className='flex flex-col gap-4 justify-center items-center w-full h-full'>
                    <div className='text-left w-full bg-[#F4F4F4] py-3 px-4 rounded'>
                        <div>
                            댓글 내용: {commentContent}
                        </div>
                        <div>
                            작성자: {commentWriter}
                        </div>
                    </div>

                    <div className='px-2 text-left w-full text-[#8A8A8A]'>
                        사유 선택
                    </div>

                    <ul className='w-full border border-[#EAEAEA] py-3 px-4 rounded gap-4 flex flex-col'>
                        <li>
                            <label htmlFor="option1" className={"flex items-center cursor-pointer " + (selectedOption ? selectedOption === "option1" ? "font-medium" : "text-[#E3E3E3]" : "")}>
                                <input type="radio" id="option1" name="options" className="hidden peer"
                                    onChange={handleRadioChange} />
                                <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                                스팸홍보/도배 댓글입니다.
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option2" className={"flex items-center cursor-pointer " + (selectedOption ? selectedOption === "option2" ? "font-medium" : "text-[#E3E3E3]" : "")}>
                                <input type="radio" id="option2" name="options" className="hidden peer"
                                    onChange={handleRadioChange} />
                                <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                                음란물입니다.
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option3" className={"flex items-center cursor-pointer " + (selectedOption ? selectedOption === "option3" ? "font-medium" : "text-[#E3E3E3]" : "")}>
                                <input type="radio" id="option3" name="options" className="hidden peer"
                                    onChange={handleRadioChange} />
                                <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                                분란을 조장하는 댓글입니다.
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option4" className={"flex items-center cursor-pointer " + (selectedOption ? selectedOption === "option4" ? "font-medium" : "text-[#E3E3E3]" : "")}>
                                <input type="radio" id="option4" name="options" className="hidden peer"
                                    onChange={handleRadioChange} />
                                <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                                게시글에 맞지 않는 댓글입니다.
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option5" className={"flex items-center cursor-pointer " + (selectedOption ? selectedOption === "option5" ? "font-medium" : "text-[#E3E3E3]" : "")}>
                                <input type="radio" id="option5" name="options" className="hidden peer"
                                    onChange={handleRadioChange} />
                                <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                                특정인을 비방하는 내용을 포함하고 있습니다.
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option6" className={"flex items-center cursor-pointer " + (selectedOption ? selectedOption === "option6" ? "font-medium" : "text-[#E3E3E3]" : "")}>
                                <input type="radio" id="option6" name="options" className="hidden peer"
                                    onChange={handleRadioChange} />
                                <span className="w-6 h-6 mr-2 border-2 border-gray-400 rounded-full peer-checked:bg-[#816DFF] peer-checked:border-[#816DFF]"></span>
                                기타 게시판 이용 규칙을 어겼습니다.
                            </label>
                        </li>
                    </ul>
                    <button
                        type="submit"
                        className="w-full py-4 rounded-md mt-2 disabled:bg-[#CDC5FF] disabled:cursor-not-allowed  bg-[#816DFF] text-white peer-checked:enabled:bg-[#816DFF]"
                        disabled={selectedOption === null}
                        title='신고하기'
                    >
                        신고하기
                    </button>
                </form>
            </Modal>
        </>
    );
}

export default CommentMenu