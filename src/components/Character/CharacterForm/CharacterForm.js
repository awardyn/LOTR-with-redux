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
import { ErrorMessage, Field, Formik } from 'formik';
import MaterialTable from 'material-table';
import {
  createCharacter,
  getCharacterQuotes,
  getCharacters,
  getMovies,
  updateCharacter,
} from '../../../store/actions';
import { charactersSelector, moviesSelector } from '../../../store/selectors';
import { confirmClose } from '../../../utils/confirmClose';
import { genderOptions, raceOptions } from '../../../utils/const';
import { selectStyle } from '../../../utils/selectStyle';
import { ErrorToast, SelectField, SuccessToast } from '../../StaticComponents';
import * as S from './CharacterForm.css';

const CharacterForm = ({
  editCharacter,
  editMode,
  handleClose,
  open,
  characters,
  getCharacters,
  getCharacterQuotes,
  getMovies,
  movies,
  id,
  createCharacter,
  updateCharacter,
}) => {
  const [movie, setMovie] = useState(null);
  const [quotesList, setQuotesList] = useState([]);
  const [quote, setQuote] = useState({ dialog: '', movie: '', movie_id: '' });

  const moviesOptions = useMemo(
    () =>
      movies.movies.map((movie) => ({
        value: movie.unique_id,
        label: movie.name,
      })),
    [movies],
  );

  const genderOptionsFiltered = genderOptions.filter(
    (option) => option.value !== 'All',
  );

  const raceOptionsFiltered = raceOptions.filter(
    (option) => option.value !== 'All',
  );

  const initialValues = useMemo(() => {
    return editMode
      ? {
          name: editCharacter.name,
          race: editCharacter.race,
          gender: editCharacter.gender,
          spouse: editCharacter.spouse,
          death: editCharacter.death,
          realm: editCharacter.realm,
          wikiurl: editCharacter.wikiurl,
        }
      : {
          name: '',
          race: undefined,
          gender: undefined,
          spouse: '',
          death: '',
          realm: '',
          wikiurl: '',
        };
  }, [editMode, editCharacter]);

  const title = editMode ? 'Edit Character' : 'Add Character';

  const getMovieLabel = useCallback(
    (movieUniqueId) => {
      return (
        moviesOptions.find((option) => option.value === movieUniqueId)?.label ??
        ''
      );
    },
    [moviesOptions],
  );

  useEffect(() => {
    if (editMode) {
      setQuotesList([
        ...characters.characterQuotes.map((quote) => ({
          dialog: quote.dialog,
          movie: getMovieLabel(quote.movie),
          movie_id: quote.movie,
        })),
      ]);
    }
  }, [setQuotesList, characters, getMovieLabel, editMode]);

  useEffect(() => {
    if (editMode) {
      getCharacterQuotes(id);
    }
  }, [getCharacterQuotes, id, editMode]);

  useEffect(() => {
    if (movies.movies.length === 0 || movies.searched === true) {
      getMovies('');
    }
  }, [getMovies, movies]);

  useEffect(() => {
    if (characters.characters.length === 0 || characters.searched === true) {
      getCharacters('');
    }
  }, [getCharacters, characters]);

  const handleChangeMovie = (event) => {
    setMovie(event);
    if (event === null || event === undefined) {
      setQuote((quote) => ({ dialog: quote.dialog, movie: '', movie_id: '' }));
    } else {
      setQuote((quote) => ({
        dialog: quote.dialog,
        movie: event.label,
        movie_id: event.value,
      }));
    }
  };

  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  const handleConfirmClose = () => {
    confirmClose(handleClose);
  };

  const handleSend = async (data) => {
    let resp;
    if (editMode) {
      resp = updateCharacter(editCharacter.id, data);
    } else {
      resp = createCharacter(data);
    }
    resp.then((res) => {
      if (res.error) {
        toast.error(<ErrorToast message={res.payload?.message} />);
      } else {
        toast.success(<SuccessToast message="Character has been saved" />);
      }
      getCharacters('');
      if (editMode) {
        getCharacterQuotes(editCharacter.id);
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
              } else {
                const arrayOfWordsInName = values.name.split(' ');
                const smallLetter = arrayOfWordsInName.some(
                  (word) => word[0] !== word[0]?.toUpperCase(),
                );
                if (smallLetter) {
                  errors.name =
                    'Every word of name must starts with capital letter';
                }
              }
              if (!values.race) {
                errors.race = 'Required';
              }
              if (!values.gender) {
                errors.gender = 'Required';
              }
              if (!isValidHttpUrl(values.wikiurl) && values.wikiurl !== '') {
                errors.wikiurl = 'Must be valid URL link';
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
                  <p>Race</p>
                  <Field
                    name="race"
                    component={SelectField}
                    options={raceOptionsFiltered}
                    placeholder="Race"
                    value={values.race}
                  />
                  <ErrorMessage name="race" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <p>Gender</p>
                  <Field
                    name="gender"
                    component={SelectField}
                    options={genderOptionsFiltered}
                    placeholder="Gender"
                    value={values.gender}
                  />
                  <ErrorMessage name="gender" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    name="spouse"
                    onChange={handleChange}
                    label="Spouse"
                    autoFocus
                    style={{ textTransform: 'capitalize', width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.spouse}
                  />
                  <ErrorMessage name="spouse" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    name="death"
                    onChange={handleChange}
                    label="Death"
                    autoFocus
                    style={{ textTransform: 'capitalize', width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.death}
                  />
                  <ErrorMessage name="death" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    name="realm"
                    onChange={handleChange}
                    label="Realm"
                    autoFocus
                    style={{ textTransform: 'capitalize', width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.realm}
                  />
                  <ErrorMessage name="realm" component="p" />
                </S.ElementContainer>
                <S.ElementContainer>
                  <TextField
                    name="wikiurl"
                    onChange={handleChange}
                    label="Wiki url"
                    autoFocus
                    style={{ textTransform: 'capitalize', width: '100%' }}
                    fullWidth
                    size="medium"
                    value={values.wikiurl}
                  />
                  <ErrorMessage name="wikiurl" component="p" />
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
                        movie: quote.movie,
                        movie_id: quote.movie_id,
                      }));
                    }}
                  />
                  <S.SelectContainer>
                    <Select
                      options={moviesOptions}
                      menuPortalTarget={document.body}
                      isClearable
                      isSearchable={true}
                      placeholder="Select Movie"
                      styles={selectStyle}
                      onChange={handleChangeMovie}
                      value={movie}
                    />
                  </S.SelectContainer>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      if (quote.movie === '') {
                        alert('Movie must be filled in');
                        return;
                      } else if (quote.dialog === '') {
                        alert('Dialog must be filled in');
                        return;
                      }
                      setQuotesList((quotesList) => {
                        return [...quotesList, quote];
                      });
                      setQuote({ dialog: '', movie: '', movie_id: '' });
                      setMovie(null);
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
                    { title: 'Movie', field: 'movie' },
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
                              quote.movie === rowData.movie,
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
                        setQuotesList(characters.characterQuotes);
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
  getCharacterQuotes,
  getMovies,
  createCharacter,
  updateCharacter,
})(CharacterForm);
