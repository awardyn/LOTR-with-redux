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
import MovieForm from '../MovieForm';
import * as S from '../../Styles.css';

const columns = [
  { title: 'Name', field: 'name', width: '50vw' },
  { title: 'Academy award wins', field: 'academyawardwins', width: '25vw' },
  {
    title: 'Rotten Tomatoes Score',
    field: 'rottentomatesscore',
    width: '25vw',
  },
];

const MovieList = ({ getMovies, movies, deleteMovie }) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editMovie, setEditMovie] = useState({});
  const [movieId, setMovieId] = useState();
  const [searchedOnEnter, setSearchedOnEnter] = useState(false);

  const [openForm, handleClickOpenForm, handleCloseForm] = useToggle();

  const { push } = useHistory();

  useEffect(() => {
    if (search !== '') {
      getMovies(search);
    }
  }, [getMovies, search]);

  useEffect(() => {
    if (!movies?.movies?.length && !searchedOnEnter) {
      setSearchedOnEnter(true);
      getMovies('');
    }
  }, [getMovies, movies, searchedOnEnter]);

  useEffect(() => {
    if (movies?.searched && search === '') {
      getMovies('');
    }
  }, [getMovies, movies, search]);

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

  const addNewMovie = () => {
    setEditMode(false);
    handleClickOpenForm();
  };

  const handleEditMovie = (movie) => {
    setMovieId(movie.id);
    setEditMode(true);
    setEditMovie(movie);
    handleClickOpenForm();
  };

  const handleDelete = async (id) => {
    const deleteConfirm = window.confirm(
      'Are you sure that you want to delete this movie?',
    );
    if (deleteConfirm) {
      const response = deleteMovie(id);
      response.then((res) => {
        if (res.error) {
          toast.error(<ErrorToast message={res.payload?.message} />);
        } else {
          toast.success(<SuccessToast message="Movie has been deleted" />);
          getMovies('');
        }
      });
    }
  };

  return (
    <S.TableContainer>
      <Typography variant="h3">Movies</Typography>
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
                  onClick={addNewMovie}
                >
                  Add Movie
                </Button>
              </Box>
            </Box>
          ),
        }}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        columns={columns}
        data={movies?.movies}
        onRowClick={(event, rowData) => {
          push(`/movies/${rowData?.id}`);
        }}
        options={{
          maxBodyHeight: '70vh',
          actionsColumnIndex: -1,
          searchFieldAlignment: 'left',
          pageSize: rowsPerPage,
          pageSizeOptions: [10, 25, 50, 100],
          rowStyle: { padding: '0 1rem' },
          debounceInterval: 300,
        }}
        onSearchChange={setDataSearch}
        actions={[
          {
            icon: () => <EditIcon color="action" />,
            tooltip: 'Edit movie',
            onClick: (event, rowData) => handleEditMovie(rowData),
          },
          {
            icon: () => <DeleteIcon color="action" />,
            tooltip: 'Delete movie',
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
        <MovieForm
          editMovie={editMovie}
          editMode={editMode}
          handleClose={handleCloseForm}
          open
          id={movieId}
        />
      )}
    </S.TableContainer>
  );
};

export default MovieList;
