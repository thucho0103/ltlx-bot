import React from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ imageUrl, title, onClose }) {
  if (!imageUrl) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn cursor-zoom-out"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-3xl w-full bg-white p-4 rounded-3xl border border-slate-200 shadow-2xl space-y-3 cursor-default animate-scaleUp"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-2">
          <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate max-w-md">
            {title || 'Hình Ảnh Minh Họa'}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 overflow-hidden max-h-[75vh] flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={title || 'Minh họa'} 
            className="max-h-[70vh] w-auto object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
