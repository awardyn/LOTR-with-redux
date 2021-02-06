import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { MTableToolbar } from 'material-table';
import { usePaginatedTable, useToggle } from '../../../utils/hooks';
import { ErrorToast, SuccessToast, Table } from '../../StaticComponents';
import BookForm from '../BookForm';
import * as S from '../../Styles.css';

const BookList = ({ getBooks, books, deleteBook }) => {
  const [pageSize, setPageSize] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editBook, setEditBook] = useState({});
  const [openForm, handleClickOpenForm, handleCloseForm] = useToggle();
  const [bookId, setBookId] = useState();
  const [searchedOnEnter, setSearchedOnEnter] = useState(false);
  const { push } = useHistory();

  const columns = [{ title: 'Name', field: 'name' }];
  useEffect(() => {
    if (search !== '') {
      getBooks(search);
    }
  }, [getBooks, search]);

  useEffect(() => {
    if (!books?.books?.length && !searchedOnEnter) {
      setSearchedOnEnter(true);
      getBooks('');
    }
  }, [getBooks, books, searchedOnEnter]);

  useEffect(() => {
    if (books?.searched && search === '') {
      getBooks('');
    }
  }, [getBooks, books, search]);

  const {
    page,
    rowsPerPage,
    resetPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = usePaginatedTable(pageSize, pageNumber);

  useEffect(() => {
    setPageNumber(page);
    setPageSize(rowsPerPage);
  }, [page, rowsPerPage, setPageSize, setPageNumber]);

  const setDataSearch = (value: string) => {
    setSearch(value);
    if (resetPage) {
      resetPage();
    }
  };

  const addNewBook = () => {
    setEditMode(false);
    handleClickOpenForm();
  };

  const handleEditBook = (book) => {
    setBookId(book.id);
    setEditMode(true);
    setEditBook(book);
    handleClickOpenForm();
  };

  const handleDelete = async (id) => {
    const deleteFormConfirm = window.confirm(
      'Are you sure that you want to delete this book?',
    );
    if (deleteFormConfirm) {
      const response = deleteBook(id);
      response.then((res) => {
        if (res.error) {
          toast.error(<ErrorToast message={res.payload?.message} />);
        } else {
          toast.success(<SuccessToast message="Book has been deleted" />);
          getBooks('');
        }
      });
    }
  };

  return (
    <S.TableContainer>
      <Typography variant="h3">Books</Typography>
      <Table
        title=""
        components={{
          Toolbar: (props) => (
            <Box m={1} display="flex" justifyContent="space-between">
              <MTableToolbar
                {...props}
                classes={{ searchField: 'material-table-search-field' }}
              />
              <Box m={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addNewBook}
                >
                  Add Book
                </Button>
              </Box>
            </Box>
          ),
        }}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        columns={columns}
        data={books?.books}
        onRowClick={(event, rowData) => {
          push(`/books/${rowData.id}`);
        }}
        options={{
          maxBodyHeight: '70vh',
          actionsColumnIndex: -1,
          searchFieldAlignment: 'left',
          pageSize: rowsPerPage,
          pageSizeOptions: [3, 5, 8, 10],
          rowStyle: { padding: '0 1rem' },
          debounceInterval: 300,
        }}
        onSearchChange={setDataSearch}
        actions={[
          {
            icon: () => <EditIcon color="action" />,
            tooltip: 'Edit book',
            onClick: (event, rowData) => handleEditBook(rowData),
          },
          {
            icon: () => <DeleteIcon color="action" />,
            tooltip: 'Delete book',
            onClick: (event, rowData) => handleDelete(rowData.id),
          },
        ]}
        localization={{
          toolbar: {
            searchPlaceholder: 'Search by name',
          },
        }}
      />
      {openForm && (
        <BookForm
          id={bookId}
          editBook={editBook}
          editMode={editMode}
          handleClose={handleCloseForm}
          open
        />
      )}
    </S.TableContainer>
  );
};

export default BookList;
