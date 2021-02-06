import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { ErrorMessage, Formik } from 'formik';
import MaterialTable from 'material-table';
import {
  createBook,
  getBookChapters,
  getBooks,
  updateBook,
} from '../../../store/actions';
import { booksSelector } from '../../../store/selectors';
import { confirmClose } from '../../../utils/confirmClose';
import { ErrorToast, SuccessToast } from '../../StaticComponents';
import * as S from './BookForm.css';

const columns = [{ title: 'Chapter name', field: 'chaptername' }];

const BookForm = ({
  editBook,
  editMode,
  handleClose,
  open,
  getBooks,
  getBookChapters,
  chapters,
  id,
  updateBook,
  createBook,
}) => {
  const [chaptersList, setChaptersList] = useState([]);
  const [chapter, setChapter] = useState('');

  const initialValues = useMemo(() => {
    return editMode
      ? {
          name: editBook.name,
        }
      : { name: '' };
  }, [editMode, editBook]);

  const title = editMode ? 'Edit Book' : 'Add Book';

  useEffect(() => {
    if (editMode) {
      getBookChapters(id);
    }
  }, [getBookChapters, id, editMode]);

  useEffect(() => {
    if (editMode) {
      setChaptersList([...chapters]);
    }
  }, [setChaptersList, chapters, editMode]);

  const handleConfirmClose = () => {
    confirmClose(handleClose);
  };

  const handleSend = async (data) => {
    let resp;
    if (editMode) {
      resp = updateBook(editBook.id, data);
    } else {
      resp = createBook(data);
    }
    resp.then((res) => {
      if (res.error) {
        toast.error(<ErrorToast message={res.payload?.message} />);
      } else {
        toast.success(<SuccessToast message="Book has been saved" />);
      }
      getBooks('');
      if (editMode) {
        getBookChapters(editBook.id);
      }
      handleClose();
    });
  };

  return (
    <form autoComplete="off">
      <Dialog
        open={open}
        onClose={handleConfirmClose}
        fullWidth={true}
        maxWidth="xl"
      >
        <S.Header>
          <Tooltip title={title}>
            <S.HeaderTitle variant="h6">{title}</S.HeaderTitle>
          </Tooltip>
          <IconButton onClick={handleConfirmClose}>
            <CloseIcon />
          </IconButton>
        </S.Header>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.dialog = 'Required';
              } else if (values.name.length <= 2) {
                errors.name = 'Name is too short';
              } else if (values.name.length > 200) {
                errors.name =
                  'Name is too long (maximum length of 200 characters exceeded)';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await handleSend({ ...values, chapters: chaptersList });
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, handleChange, values, resetForm }) => (
              <S.FormContainer>
                <S.ElementContainer>
                  <TextField
                    name="name"
                    onChange={handleChange}
                    label="Name"
                    autoFocus
                    style={{ textTransform: 'capitalize', width: '100%' }}
                    fullWidth
                    value={values.name}
                  />
                  <ErrorMessage name="name" component="p" />
                </S.ElementContainer>
                <S.SelectContainer>
                  <TextField
                    label="New Chapter"
                    fullWidth
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      if (
                        chaptersList.some(
                          (chapterElement) =>
                            chapterElement.chaptername === chapter,
                        )
                      ) {
                        toast.error(
                          <ErrorToast message="Chapter name must be different" />,
                        );
                        return;
                      }
                      setChaptersList((chaptersList) => {
                        return [...chaptersList, { chaptername: chapter }];
                      });
                      setChapter('');
                    }}
                  >
                    Add
                  </Button>
                </S.SelectContainer>
                <MaterialTable
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    marginTop: '1rem',
                  }}
                  columns={columns}
                  data={chaptersList}
                  options={{
                    actionsColumnIndex: -1,
                    maxBodyHeight: '40vh',
                    search: false,
                    toolbar: false,
                    headerStyle: { zIndex: 1 },
                    paging: false,
                    rowStyle: {
                      width: '100%',
                    },
                    sorting: false,
                  }}
                  actions={[
                    {
                      icon: () => <DeleteIcon color="action" />,
                      tooltip: 'Delete book',
                      onClick: (event, rowData) =>
                        setChaptersList((chaptersList) => [
                          ...chaptersList.filter(
                            (chapter) =>
                              chapter.chaptername !== rowData.chaptername,
                          ),
                        ]),
                    },
                  ]}
                />
                <S.ButtonsContainer>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      const resetFormConfirm = window.confirm(
                        'Are you sure that you want to reset form?',
                      );
                      if (resetFormConfirm) {
                        resetForm(initialValues);
                        setChaptersList([...chapters]);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </S.ButtonsContainer>
              </S.FormContainer>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    chapters: booksSelector(state).chapters,
  };
};

export default connect(mapStateToProps, {
  getBooks,
  getBookChapters,
  updateBook,
  createBook,
})(BookForm);
