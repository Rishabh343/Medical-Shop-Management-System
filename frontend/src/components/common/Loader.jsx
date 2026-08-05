import React from "react";

export default function Loader({ fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm"
          : "py-20"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-stone-900 animate-spin"></div>

        <p className="text-sm font-medium text-stone-500">Loading...</p>
      </div>
    </div>
  );
}
