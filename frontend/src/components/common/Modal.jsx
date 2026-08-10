import React from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-2xl">

        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">

          <h2 className="text-lg font-semibold text-stone-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
          >
            ×
          </button>

        </div>

        <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">
          {children}
        </div>

      </div>

    </div>
  );
}