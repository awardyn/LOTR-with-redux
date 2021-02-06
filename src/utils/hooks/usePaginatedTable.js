import { useCallback, useState } from 'react';
//TODO think about testing it
export const usePaginatedTable = (initialRowsPerPage, initialPage?) => {
  const [page, setPage] = useState(initialPage || 0);

  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  const handleChangeRowsPerPage = useCallback((value) => {
    setRowsPerPage(value);
    setPage(0);
  }, []);

  return {
    page,
    rowsPerPage,
    resetPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
