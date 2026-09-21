'use client';

import React from 'react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={clsx(
          'relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4',
          className
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
