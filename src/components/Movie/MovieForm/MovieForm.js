import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
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
  createMovie,
  getCharacters,
  getMovieQuotes,
  getMovies,
  updateMovie,
} from '../../../store/actions';
import { charactersSelector, moviesSelector } from '../../../store/selectors';
import { confirmClose } from '../../../utils/confirmClose';
import { selectStyle } from '../../../utils/selectStyle';
import { ErrorToast, SuccessToast } from '../../StaticComponents';
import * as S from './MovieForm.css';

const MovieForm = ({
  editMovie,
  editMode,
  handleClose,
  open,
  characters,
  getCharacters,
  getMovieQuotes,
  getMovies,
  movies,
  id,
  updateMovie,
  createMovie,
}) => {
  const [character, setCharacter] = useState(null);
  const [quotesList, setQuotesList] = useState([]);
  const [quote, setQuote] = useState({
    dialog: '',
    character: '',
    character_id: '',
  });

  const charactersOptions = useMemo(
    () =>
      characters.characters.map((character) => ({
        value: character.unique_id,
        label: character.name,
      })),
    [characters],
  );

  const initialValues = useMemo(() => {
    return editMode
      ? {
          name: editMovie.name,
          runtimeinminutes: editMovie.runtimeinminutes,
          budgetinmillions: editMovie.budgetinmillions,
          boxofficerevenueinmillions: editMovie.boxofficerevenueinmillions,
          academyawardnominations: editMovie.academyawardnominations,
          academyawardwins: editMovie.academyawardwins,
          rottentomatesscore: editMovie.rottentomatesscore,
        }
      : {
          name: '',
          runtimeinminutes: 0,
          budgetinmillions: 0,
          boxofficerevenueinmillions: 0,
          academyawardnominations: 0,
          academyawardwins: 0,
          rottentomatesscore: 0,
        };
  }, [editMode, editMovie]);

  const title = editMode ? 'Edit Movie' : 'Add Movie';

  const getCharacterLabel = useCallback(
    (characterUniqueId) => {
      return (
        charactersOptions.find((option) => option.value === characterUniqueId)
          ?.label ?? ''
      );
    },
    [charactersOptions],
  );

  useEffect(() => {
    if (editMode) {
      setQuotesList([
        ...movies.movieQuotes.map((quote) => ({
          dialog: quote.dialog,
          character: getCharacterLabel(quote.character),
          character_id: quote.character,
        })),
      ]);
    }
  }, [setQuotesList, movies, getCharacterLabel, editMode]);

  useEffect(() => {
    if (editMode) {
      getMovieQuotes(id);
    }
  }, [getMovieQuotes, id, editMode]);

  useEffect(() => {
    if (characters.characters.length === 0 || characters.searched === true) {
      getCharacters('');
    }
  }, [getCharacters, characters]);

  useEffect(() => {
    if (movies.movies.length === 0 || movies.searched === true) {
      getMovies('');
    }
  }, [getMovies, movies]);

  const handleChangeCharacter = (event) => {
    setCharacter(event);
    if (event === null || event === undefined) {
      setQuote((quote) => ({
        dialog: quote.dialog,
        character: '',
        character_id: '',
      }));
    } else {
      setQuote((quote) => ({
        dialog: quote.dialog,
        character: event.label,
        character_id: event.value,
      }));
    }
  };

  const handleConfirmClose = () => {
    confirmClose(handleClose);
  };

  const handleSend = async (data) => {
    let resp;
    if (editMode) {
      resp = updateMovie(editMovie.id, data);
    } else {
      resp = createMovie(data);
    }
    resp.then((res) => {
      if (res.error) {
        toast.error(<ErrorToast message={res.payload?.message} />);
      } else {
        toast.success(<SuccessToast message="Movie has been saved" />);
      }
      getMovies('');
      if (editMode) {
        getMovieQuotes(editMovie.id);
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
        maxWidth="lg"
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
                errors.name = 'Required';
              } else if (values.name.length <= 2) {
                errors.name = 'Name is too short';
              } else if (values.name.length > 200) {
                errors.name =
                  'Name is too long (maximum length of 200 characters exceeded)';
              }
              if (!values.runtimeinminutes || values.runtimeinminutes <= 0) {
                errors.runtimeinminutes = 'Run time must be greater than 0';
              }
              if (!values.budgetinmillions || values.budgetinmillions <= 0) {
                errors.budgetinmillions = 'Budget must be greater than 0';
              }
              if (
                !!values.boxofficerevenueinmillions &&
                values.boxofficerevenueinmillions < 0
              ) {
                errors.boxofficerevenueinmillions =
                  'Box office revenue must be greater or equal 0';
              }
              if (
                !!values.academyawardnominations &&
                values.academyawardnominations < 0
              ) {
                errors.academyawardnominations =
                  'Academy award nominations must be greater or equal 0';
              }
              if (!!values.academyawardwins && values.academyawardwins < 0) {
                errors.academyawardwins =
                  'Academy award wins must be greater or equal 0';
              }
              if (!!values.tomatesscore && values.tomatesscore < 0) {
                errors.tomatesscore =
                  'Tomatoes score must be greater or equal 0';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await handleSend({ ...values, quotes: quotesList });
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
                    size="medium"
                    value={values.name}
                  />
                  <ErrorMessage name="name" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    type="number"
                    name="runtimeinminutes"
                    onChange={handleChange}
                    label="Run time in minutes"
                    autoFocus
                    style={{ width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.runtimeinminutes}
                  />
                  <ErrorMessage name="runtimeinminutes" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    type="number"
                    name="budgetinmillions"
                    onChange={handleChange}
                    label="Budget in millions"
                    autoFocus
                    style={{ width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.budgetinmillions}
                  />
                  <ErrorMessage name="budgetinmillions" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    type="number"
                    name="boxofficerevenueinmillions"
                    onChange={handleChange}
                    label="Box office revenue in millions"
                    autoFocus
                    style={{ width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.boxofficerevenueinmillions}
                  />
                  <ErrorMessage
                    name="boxofficerevenueinmillions"
                    component="p"
                  />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    type="number"
                    name="academyawardnominations"
                    onChange={handleChange}
                    label="Academy award nominations"
                    autoFocus
                    style={{ width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.academyawardnominations}
                  />
                  <ErrorMessage name="academyawardnominations" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    type="number"
                    name="academyawardwins"
                    onChange={handleChange}
                    label="Academy award wins"
                    autoFocus
                    style={{ width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.academyawardwins}
                  />
                  <ErrorMessage name="academyawardwins" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    type="number"
                    name="rottentomatesscore"
                    onChange={handleChange}
                    label="Rotten tomatoes score"
                    autoFocus
                    style={{ width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.rottentomatesscore}
                  />
                  <ErrorMessage name="rottentomatesscore" component="p" />
                </S.ElementContainer>
                <S.SelectsContainer>
                  <TextField
                    label="New Quote"
                    fullWidth
                    name="dialog"
                    value={quote.dialog}
                    onChange={(e) => {
                      e.persist();
                      setQuote((quote) => ({
                        dialog: e.target?.value,
                        character: quote.character,
                        character_id: quote.character_id,
                      }));
                    }}
                  />
                  <S.SelectContainer>
                    <Select
                      options={charactersOptions}
                      menuPortalTarget={document.body}
                      isClearable
                      isSearchable={true}
                      placeholder="Select Character"
                      styles={selectStyle}
                      onChange={handleChangeCharacter}
                      value={character}
                    />
                  </S.SelectContainer>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      if (quote.character === '') {
                        alert('Character must be filled in');
                        return;
                      } else if (quote.dialog === '') {
                        alert('Dialog must be filled in');
                        return;
                      }
                      setQuotesList((quotesList) => {
                        return [...quotesList, quote];
                      });
                      setQuote({ dialog: '', character: '', character_id: '' });
                      setCharacter(null);
                    }}
                  >
                    Add
                  </Button>
                </S.SelectsContainer>
                <MaterialTable
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    marginTop: '1rem',
                  }}
                  columns={[
                    { title: 'Dialog', field: 'dialog' },
                    { title: 'Character', field: 'character' },
                  ]}
                  data={quotesList}
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
                      tooltip: 'Delete quote',
                      onClick: (event, rowData) =>
                        setQuotesList((quotesList) => [
                          ...quotesList.filter(
                            (quote) =>
                              quote.dialog !== rowData.dialog &&
                              quote.character === rowData.character,
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
                        setQuotesList(movies.quotesList);
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
  getMovieQuotes,
  getMovies,
  updateMovie,
  createMovie,
})(MovieForm);
