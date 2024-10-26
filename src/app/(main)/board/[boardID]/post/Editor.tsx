'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css'; // 기본 스타일 적용

const Editor = dynamic(() => import('draft-js').then(mod => mod.Editor), { ssr: false });

const DraftEditor: React.FC<{ boardID: number }> = ({ boardID }) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (newState: EditorState) => {
        setEditorState(newState);
    };

    const handlePosting = ()=>{
        
    }
    return (
        <>
            <div className='relative p-4 h-full overflow-y-scroll' style={{ scrollbarWidth: 'thin' }}>
                <input type="text" name="Title" id="Title" placeholder='제목을 입력하세요' className='min-w-80 w-4/6 border-b border-b-gray-300 font-medium text-xl pb-0.5 mb-2' />
                <Editor
                    editorState={editorState}
                    placeholder="글을 작성하세요"
                    onChange={handleEditorChange}
                />
                <div className='sticky flex flex-row items-center justify-end bottom-6 right=0 z-10'>
                    <div className='bg-gray-400 flex items-center justify-center text-white cursor-pointer rounded-sm w-12 h-8'>
                        저장
                    </div>
                </div>
            </div>
        </>
    );
};

export default DraftEditor;