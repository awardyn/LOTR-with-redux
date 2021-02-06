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
  deleteMovie,
  deleteQuote,
  getMovieQuotes,
  getMovies,
} from '../../../store/actions';
import { movieSelector, moviesSelector } from '../../../store/selectors';
import { usePaginatedTable, useToggle } from '../../../utils/hooks';
import QuoteForm from '../../Quote/QuoteForm';
import { ErrorToast, SuccessToast, Table } from '../../StaticComponents';
import MovieForm from '../MovieForm';
import * as S from '../../Styles.css';

const MovieItem = ({
  movie,
  movieQuotes,
  getMovieQuotes,
  match,
  getMovies,
  movies,
  deleteMovie,
  deleteQuote,
}) => {
  const columns = [{ title: 'Dialog', field: 'dialog' }];

  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editQuote, setEditQuote] = useState();

  const [openForm, handleClickOpenForm, handleCloseForm] = useToggle();
  const [
    openQuoteForm,
    handleClickOpenQuoteForm,
    handleCloseQuoteForm,
  ] = useToggle();

  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = usePaginatedTable(pageSize, pageNumber);

  const paramId = match?.params?.id;
  const { push } = useHistory();

  useEffect(() => {
    if (!movie && movies.length > 0) {
      toast.error(<ErrorToast message={`Movie of given id does not exists`} />);
      push('/movies');
    } else if (movies.length === 0) {
      getMovies('');
    }
  }, [movie, push, getMovies, movies]);

  useEffect(() => {
    if (!!movie) {
      getMovieQuotes(paramId);
    }
  }, [getMovieQuotes, paramId, movie]);

  useEffect(() => {
    setPageNumber(page);
    setPageSize(rowsPerPage);
  }, [page, rowsPerPage, setPageSize, setPageNumber]);

  const handleDelete = async () => {
    const deleteConfirm = window.confirm(
      'Are you sure that you want to delete this movie?',
    );
    if (deleteConfirm) {
      const response = deleteMovie(movie.id);
      response
        .then((res) => {
          if (res.error) {
            toast.error(<ErrorToast message={res.payload?.message} />);
          } else {
            toast.success(<SuccessToast message="Movie has been deleted" />);
            getMovies('');
          }
        })
        .finally(() => {
          push('/movies');
        });
    }
  };

  const addNewQuote = () => {
    setEditMode(false);
    handleClickOpenQuoteForm();
  };

  const handleEditQuote = (quote) => {
    setEditMode(true);
    setEditQuote(quote);
    handleClickOpenQuoteForm();
  };

  const handleDeleteQuote = async (id) => {
    const deleteConfirm = window.confirm(
      'Are you sure that you want to delete this quote?',
    );
    if (deleteConfirm) {
      const response = deleteQuote(id);
      response.then((res) => {
        if (res.error) {
          toast.error(<ErrorToast message={res.payload?.message} />);
        } else {
          toast.success(<SuccessToast message="Quote has been deleted" />);
          getMovieQuotes(paramId);
        }
      });
    }
  };

  return (
    <>
      <S.Container>
        <Typography variant="h2">{movie?.name}</Typography>
        <Typography variant="h4">
          Run time in minutes: {movie?.runtimeinminutes ?? 'Unknown'}
        </Typography>
        <Typography variant="h4">
          Budget in millions: {movie?.budgetinmillions ?? 'Unknown'}
        </Typography>
        <Typography variant="h4">
          Box office revenue in millions:{' '}
          {movie?.boxofficerevenueinmillions ?? 'Unknown'}
        </Typography>
        <Typography variant="h4">
          Academy award nominations:{' '}
          {movie?.academyawardnominations ?? 'Unknown'}
        </Typography>
        <Typography variant="h4">
          Academy award wins: {movie?.academyawardwins ?? 'Unknown'}
        </Typography>
        <Typography variant="h4">
          Rotten tomatoes score: {movie?.rottentomatesscore ?? 'Unknown'}
        </Typography>
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
        <Typography variant="h3">Quotes from movie</Typography>
        <Table
          title=""
          components={{
            Toolbar: (props) => (
              <Box m={2} display="flex" justifyContent="space-between">
                <MTableToolbar
                  {...props}
                  classes={{ searchField: 'material-table-search-field' }}
                />
                <Box m={1}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addNewQuote}
                  >
                    Add Quote
                  </Button>
                </Box>
              </Box>
            ),
          }}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          columns={columns}
          data={movieQuotes}
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
              tooltip: 'Edit quote',
              onClick: (event, rowData) => handleEditQuote(rowData),
            },
            {
              icon: () => <DeleteIcon color="action" />,
              tooltip: 'Delete quote',
              onClick: (event, rowData) => handleDeleteQuote(rowData.id),
            },
          ]}
          localization={{
            toolbar: {
              searchPlaceholder: 'Search by dialog',
            },
          }}
          onRowClick={(event, rowData) => {
            push(`/quotes/${rowData.id}`);
          }}
        />
      </S.TableContainer>
      {openForm && (
        <MovieForm
          id={movie.id}
          editMovie={movie}
          editMode={true}
          handleClose={handleCloseForm}
          open
        />
      )}
      {openQuoteForm && (
        <QuoteForm
          movie={movie}
          editQuote={editQuote}
          editMode={editMode}
          handleClose={handleCloseQuoteForm}
          paramId={paramId}
          open
        />
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const movieSelectorInstance = movieSelector();
  return {
    movie: movieSelectorInstance(state, ownProps.match.params.id),
    movieQuotes: moviesSelector(state).movieQuotes,
    movies: moviesSelector(state).movies,
  };
};

export default connect(mapStateToProps, {
  getMovieQuotes,
  getMovies,
  deleteMovie,
  deleteQuote,
})(MovieItem);
