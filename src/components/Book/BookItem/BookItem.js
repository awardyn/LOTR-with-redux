import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { MTableToolbar } from 'material-table';
import {
  deleteBook,
  deleteChapter,
  getBookChapters,
  getBooks,
} from '../../../store/actions';
import { bookSelector, booksSelector } from '../../../store/selectors';
import { usePaginatedTable, useToggle } from '../../../utils/hooks';
import { ErrorToast, SuccessToast, Table } from '../../StaticComponents';
import BookForm from '../BookForm';
import ChapterForm from './ChapterForm';
import * as S from '../../Styles.css';

const columns = [{ title: 'Chapter name', field: 'chaptername' }];

const BookItem = ({
  book,
  chapters,
  getBookChapters,
  match,
  getBooks,
  books,
  deleteBook,
  deleteChapter,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [editChapter, setEditChapter] = useState({});

  const [
    openChapterForm,
    handleClickOpenChapterForm,
    handleCloseChapterForm,
  ] = useToggle();
  const [openForm, handleClickOpenForm, handleCloseForm] = useToggle();

  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = usePaginatedTable(pageSize, pageNumber);

  const id = match?.params?.id;
  const { push } = useHistory();

  useEffect(() => {
    if (!book && books.length > 0) {
      toast.error(<ErrorToast message={`Book of given id does not exists`} />);
      push('/books');
    } else if (books.length === 0) {
      getBooks('');
    }
  }, [book, push, getBooks, books]);

  useEffect(() => {
    if (!!book) {
      getBookChapters(id);
    }
  }, [getBookChapters, id, book]);

  useEffect(() => {
    setPageNumber(page);
    setPageSize(rowsPerPage);
  }, [page, rowsPerPage, setPageSize, setPageNumber]);

  const handleDelete = async () => {
    const deleteConfirm = window.confirm(
      'Are you sure that you want to delete this book?',
    );
    if (deleteConfirm) {
      const response = deleteBook(book.id);
      response
        .then((res) => {
          if (res.error) {
            toast.error(<ErrorToast message={res.payload?.message} />);
          } else {
            toast.success(<SuccessToast message="Book has been deleted" />);
            getBooks('');
          }
        })
        .finally(() => {
          push('/books');
        });
    }
  };

  const addNewChapter = () => {
    setEditMode(false);
    handleClickOpenChapterForm();
  };

  const handleEditChapter = (chapter) => {
    setEditMode(true);
    setEditChapter(chapter);
    handleClickOpenChapterForm();
  };

  const handleDeleteChapter = async (chapter) => {
    const deleteFormConfirm = window.confirm(
      'Are you sure that you want to delete this chapter?',
    );
    if (deleteFormConfirm) {
      const response = deleteChapter(chapter.id);
      response.then((res) => {
        if (res.error) {
          toast.error(<ErrorToast message={res.payload?.message} />);
        } else {
          toast.success(<SuccessToast message="Chapter has been deleted" />);
          getBookChapters(book.id);
        }
      });
    }
  };

  return (
    <>
      <S.Container>
        <Typography variant="h2">{book?.name}</Typography>
        <S.ButtonsContainer>
          <Button
            color="primary"
            variant="contained"
            onClick={handleClickOpenForm}
          >
            Edit
          </Button>
          <Button color="primary" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </S.ButtonsContainer>
      </S.Container>

      <S.TableContainer>
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
                    onClick={addNewChapter}
                  >
                    Add Chapter
                  </Button>
                </Box>
              </Box>
            ),
          }}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          columns={columns}
          data={chapters}
          options={{
            maxBodyHeight: '70vh',
            actionsColumnIndex: -1,
            searchFieldAlignment: 'left',
            pageSize: rowsPerPage,
            pageSizeOptions: [5, 10, 15, 30],
            rowStyle: { padding: '0 1rem' },
            debounceInterval: 300,
          }}
          actions={[
            {
              icon: () => <EditIcon color="action" />,
              tooltip: 'Edit chapter',
              onClick: (event, rowData) => handleEditChapter(rowData),
            },
            {
              icon: () => <DeleteIcon color="action" />,
              tooltip: 'Delete chapter',
              onClick: (event, rowData) => handleDeleteChapter(rowData),
            },
          ]}
          localization={{
            toolbar: {
              searchPlaceholder: 'Search by name',
            },
          }}
        />
      </S.TableContainer>
      {openForm && (
        <BookForm
          id={book.id}
          editBook={book}
          editMode={true}
          handleClose={handleCloseForm}
          open
        />
      )}
      {openChapterForm && (
        <ChapterForm
          book={book}
          editChapter={editChapter}
          editMode={editMode}
          handleClose={handleCloseChapterForm}
          open
        />
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const bookSelectorInstance = bookSelector();
  return {
    book: bookSelectorInstance(state, ownProps.match.params.id),
    chapters: booksSelector(state).chapters,
    books: booksSelector(state).books,
  };
};

export default connect(mapStateToProps, {
  getBookChapters,
  getBooks,
  deleteBook,
  deleteChapter,
})(BookItem);
