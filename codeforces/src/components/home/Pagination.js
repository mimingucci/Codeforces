import { useState } from "react";

function usePagination(data) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / 100);

  function currentData() {
    const begin = (currentPage - 1) * 100;
    const end = begin + 100;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }

  return { next, prev, jump, currentData, currentPage, maxPage };
}

export default usePagination;
