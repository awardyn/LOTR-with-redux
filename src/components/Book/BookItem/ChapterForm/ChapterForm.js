import React, { useMemo } from 'react';
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
import { ErrorMessage, Formik } from 'formik';
import {
  createChapter,
  getBookChapters,
  updateChapter,
} from '../../../../store/actions';
import { confirmClose } from '../../../../utils/confirmClose';
import { ErrorToast, SuccessToast } from '../../../StaticComponents';
import * as S from './ChapterForm.css';

const ChapterForm = ({
  editChapter,
  book,
  editMode,
  handleClose,
  open,
  getBookChapters,
  updateChapter,
  createChapter,
}) => {
  const initialValues = useMemo(() => {
    return editMode
      ? {
          chaptername: editChapter.chaptername,
        }
      : { chaptername: '' };
  }, [editMode, editChapter]);

  const title = editMode ? 'Edit Chapter' : 'Add Chapter';

  const handleConfirmClose = () => {
    confirmClose(handleClose);
  };

  const handleSend = async (data) => {
    let resp;
    if (editMode) {
      resp = updateChapter(editChapter.id, data);
    } else {
      resp = createChapter({ ...data, bookId: book.unique_id });
    }
    resp.then((res) => {
      if (res.error) {
        toast.error(<ErrorToast message={res.payload?.message} />);
      } else {
        toast.success(<SuccessToast message="Chapter has been saved" />);
      }
      getBookChapters(book.id);
      handleClose();
    });
  };

  return (
    <form autoComplete="off">
      <Dialog
        open={open}
        onClose={handleConfirmClose}
        fullWidth={true}
        maxWidth="sm"
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
              if (!values.chaptername) {
                errors.chaptername = 'Required';
              } else if (values.chaptername.length <= 2) {
                errors.chaptername = 'Chapter name is too short';
              } else if (values.chaptername.length > 200) {
                errors.chaptername =
                  'Chapter name is too long (maximum length of 200 characters exceeded)';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await handleSend(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, handleChange, values, resetForm }) => (
              <S.FormContainer>
                <S.ElementContainer>
                  <TextField
                    name="chaptername"
                    onChange={handleChange}
                    label="Chapter name"
                    autoFocus
                    style={{ textTransform: 'capitalize', width: '100%' }}
                    fullWidth
                    value={values.chaptername}
                  />
                  <ErrorMessage name="chaptername" component="p" />
                </S.ElementContainer>
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
                      }
                    }}
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
  return {};
};

export default connect(mapStateToProps, {
  getBookChapters,
  updateChapter,
  createChapter,
})(ChapterForm);
