import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <div className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] bg-stone-800 text-white px-4 py-2 rounded-full shadow-lg border border-stone-700 text-sm font-medium transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
      {message}
    </div>
  );
};