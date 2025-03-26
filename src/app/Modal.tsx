'use client'
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void
  title?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose, title }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서만 document 사용 가능
    setIsClient(true);

    // 모달이 열리면 body 스크롤을 잠그고, 모달이 닫히면 해제
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // 컴포넌트가 언마운트되거나 모달이 닫힐 때 스크롤 잠금을 해제
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isClient || !isOpen) return null; // 서버에서는 렌더링하지 않음

  // Create a portal for the modal to render in the top-level DOM
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div className="relative flex flex-col bg-white rounded-md shadow-lg max-w-lg w-full"
        onClick={(e) => { e.stopPropagation() }}>
        <div className='relative flex flex-row justify-center items-center h-14 px-4 border-b'>
          {title ?
            <div className='font-medium text-xl'>{title}</div> :
            <div className='h-8 w-4'></div>
          }
          <div className='right-4 self-center text-center absolute font-semibold text-4xl align-top cursor-pointer' style={{lineHeight: '3.5rem'}} onClick={onClose} title={title ? title + ' 닫기' : '닫기'}>×</div>
        </div>
        <div className='px-4 py-4'>
          {children}
        </div>
      </div>
    </div>,
    document.body // 클라이언트에서만 `document`를 사용할 수 있음
  );
};

export default Modal;