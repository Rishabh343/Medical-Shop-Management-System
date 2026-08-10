import React from "react";

export default function Loader({ fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "fixed inset-0 z-[9999] bg-[#eeeae3]/80 backdrop-blur-sm"
          : "py-16"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />

        <p className="text-sm font-medium text-stone-500">
          Loading...
        </p>
      </div>
    </div>
  );
}