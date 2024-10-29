'use client'
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css'; // 기본 스타일 적용
import { throttle } from 'lodash';
import postContext from './utils';

const Editor = dynamic(() => import('draft-js').then(mod => mod.Editor), { ssr: false });

const DraftEditor: React.FC<{ boardID: number }> = ({ boardID }) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [hasScroll, setHasScroll] = useState(false);
    const [anonymity, setAnonymity] = useState(true)
    const scrollableRef = useRef<HTMLDivElement | null>(null)

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
        
        postContext(title, text, anonymity, boardID);
    }

    return (
        <>
            <form className='relative py-4 h-full min-h-60 flex flex-col' onSubmit={handlePosting} >
                <input type="text" name="Title" id="Title" placeholder='제목을 입력하세요' className='mx-4 min-w-80 w-4/6 border-b border-b-gray-300 font-medium text-xl pb-0.5 mb-2' />
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

                    <button type='submit' className='bg-gray-400 flex items-center justify-center text-white cursor-pointer rounded-sm w-12 h-8'>
                        저장
                    </button>
                </div>
            </form>
        </>
    );
};

export default DraftEditor;