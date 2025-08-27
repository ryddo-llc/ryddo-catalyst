'use client';

import { useState } from 'react';

import { NumberedPagination, NumberedPaginationInfo } from './index';

// Demo component to show numbered pagination
export function NumberedPaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 48;
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Mock pagination info
  const paginationInfo: NumberedPaginationInfo = {
    startCursorParamName: 'before',
    endCursorParamName: 'after',
    startCursor: currentPage > 1 ? `cursor-${currentPage - 1}` : null,
    endCursor: currentPage < totalPages ? `cursor-${currentPage + 1}` : null,
    totalItems,
    itemsPerPage,
    currentPage,
    totalPages,
  };

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-bold">Numbered Pagination Demo</h2>
      <p className="mb-4 text-gray-600">
        Showing page {currentPage} of {totalPages} (Total: {totalItems} items)
      </p>
      
      <NumberedPagination 
        info={paginationInfo}
        label="Product pagination"
      />
      
      <div className="mt-4 flex gap-2">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        >
          Previous Page
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
