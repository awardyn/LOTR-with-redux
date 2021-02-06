import React, { useEffect, useMemo } from 'react';
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
import { ErrorMessage, Field, Formik } from 'formik';
import {
  createQuote,
  getCharacters,
  getMovies,
  getQuotes,
  getCharacterQuotes,
  getMovieQuotes,
  updateQuote,
} from '../../../store/actions';
import { charactersSelector, moviesSelector } from '../../../store/selectors';
import { confirmClose } from '../../../utils/confirmClose';
import { ErrorToast, SelectField, SuccessToast } from '../../StaticComponents';
import * as S from './QuoteForm.css';

const QuoteForm = ({
  editQuote,
  editMode,
  handleClose,
  open,
  characters,
  movies,
  getCharacters,
  getQuotes,
  getMovies,
  getCharacterQuotes,
  getMovieQuotes,
  character,
  movie,
  updateQuote,
  createQuote,
  paramId,
}) => {
  const moviesOptions = movies.movies.map((movie) => ({
    value: movie.unique_id,
    label: movie.name,
  }));
  const characterOptions = characters.characters.map((character) => ({
    value: character.unique_id,
    label: character.name,
  }));

  const initialValues = useMemo(() => {
    return editMode
      ? {
          dialog: editQuote.dialog,
          character: !!character
            ? character.unique_id
            : characterOptions.find(
                (character) =>
                  character.label === editQuote.charactername ||
                  character.value === editQuote.character,
              )?.value,
          movie: !!movie
            ? movie.unique_id
            : moviesOptions.find(
                (movie) =>
                  movie.label === editQuote.moviename ||
                  movie.value === editQuote.movie,
              )?.value,
        }
      : {
          dialog: '',
          character: !!character ? character.unique_id : '',
          movie: !!movie ? movie.unique_id : '',
        };
  }, [characterOptions, moviesOptions, editMode, editQuote, character, movie]);

  const title = editMode ? 'Edit Quote' : 'Add Quote';

  useEffect(() => {
    if (movies.movies.length === 0 || movies.searched === true) {
      getMovies('');
    }
  }, [getMovies, movies]);
  useEffect(() => {
    if (characters.characters.length === 0 || characters.searched === true) {
      getCharacters('');
    }
  }, [characters, getCharacters]);

  const handleConfirmClose = () => {
    confirmClose(handleClose);
  };

  const handleSend = async (data) => {
    let resp;
    if (editMode) {
      resp = updateQuote(editQuote.id, data);
    } else {
      resp = createQuote(data);
    }
    resp.then((res) => {
      if (res.error) {
        toast.error(<ErrorToast message={res.payload?.message} />);
      } else {
        toast.success(<SuccessToast message="Quote has been saved" />);
      }
      if (!!character) {
        getCharacterQuotes(paramId);
      } else if (!!movie) {
        getMovieQuotes(paramId);
      } else {
        getQuotes('');
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
              if (!values.dialog) {
                errors.dialog = 'Required';
              } else if (values.dialog.length <= 2) {
                errors.dialog = 'Dialog is too short';
              } else if (values.dialog.length > 200) {
                errors.dialog =
                  'Dialog is too long (maximum length of 200 characters exceeded)';
              }
              if (!values.movie) {
                errors.movie = 'Required';
              }
              if (!values.character) {
                errors.character = 'Required';
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
                <div>
                  <TextField
                    name="dialog"
                    onChange={handleChange}
                    label="Dialog"
                    autoFocus
                    style={{ textTransform: 'capitalize', width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.dialog}
                  />
                  <ErrorMessage name="dialog" component="p" />
                </div>
                <div>
                  <p>Character</p>
                  <Field
                    name="character"
                    component={SelectField}
                    options={characterOptions}
                    placeholder="character"
                    value={values.character}
                    disabled={!!character}
                  />
                  <ErrorMessage name="character" component="p" />
                </div>
                <div>
                  <p>Movie</p>
                  <Field
                    name="movie"
                    component={SelectField}
                    options={moviesOptions}
                    placeholder="Movie"
                    value={values.movie}
                    disabled={!!movie}
                  />
                  <ErrorMessage name="movie" component="p" />
                </div>
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
  return {
    characters: charactersSelector(state),
    movies: moviesSelector(state),
  };
};

export default connect(mapStateToProps, {
  getCharacters,
  getMovies,
  getQuotes,
  getCharacterQuotes,
  getMovieQuotes,
  updateQuote,
  createQuote,
})(QuoteForm);
