import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Container do Modal com max-height e flex column para scroll */}
      <div className={`relative w-full ${maxWidth} max-h-[85vh] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden`}>
        
        {/* Header Fixo */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700 shrink-0">
          <h3 className="text-xl font-bold text-white retro-font tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors active:scale-95"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body com Scroll automático */}
        <div className="p-0 bg-slate-800 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};