import React from 'react';
import { IoClose } from "react-icons/io5";


export default function Modal({ isOpen, onClose, title, children, bgcolor, titleStyle}) {
  if (!isOpen) return null;

  
return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className={`${bgcolor || 'bg-white'} rounded-lg shadow-2xl max-w-lg w-full relative animate-fade-in`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow"
        aria-label="Close modal"
      >
        <IoClose className="text-2xl" />
      </button>
      <div className="p-8">
        {/* Modal Title */}
        {title && (
          <h2 className={`${titleStyle||'text-gray-900 font-bold'} text-2xl font-bold mb-6 text-center tracking-tight`}>
            {title}
          </h2>
        )}

        {/* Modal Content */}
        <div className="mb-2 text-gray-700">
          {children}
        </div>
      </div>
    </div>
  </div>
);
}