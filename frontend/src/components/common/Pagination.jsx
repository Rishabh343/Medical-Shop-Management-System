import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">

      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="
          rounded-lg
          border
          border-stone-200
          bg-white
          px-3
          py-2
          text-sm
          font-medium
          text-stone-600
          transition
          hover:bg-stone-50
          hover:text-stone-900
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Previous
      </button>

      <div className="flex gap-1.5">
        {pages.map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-lg
              text-sm
              font-medium
              transition
              ${
                currentPage === page
                  ? "bg-stone-900 text-white shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="
          rounded-lg
          border
          border-stone-200
          bg-white
          px-3
          py-2
          text-sm
          font-medium
          text-stone-600
          transition
          hover:bg-stone-50
          hover:text-stone-900
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Next
      </button>

    </div>
  );
}