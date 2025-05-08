import { useEffect, useRef } from 'react';

export default function ModalWrapper({
    onClose,
    children,
  }: {
    onClose: () => void;
    children: React.ReactNode;
  }) {
    const modalRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
  
    return (
      <div className="absolute z-50 inset-0 flex items-center justify-center px-4 pointer-events-none">
        <div
          ref={modalRef}
          className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full pointer-events-auto"
        >
          {children}
        </div>
      </div>
    );
  }
  