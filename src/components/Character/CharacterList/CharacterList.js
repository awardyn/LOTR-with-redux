import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Box, Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { MTableToolbar } from 'material-table';
import { genderOptions, raceOptions } from '../../../utils/const';
import { usePaginatedTable, useToggle } from '../../../utils/hooks';
import { selectStyle } from '../../../utils/selectStyle';
import { ErrorToast, SuccessToast, Table } from '../../StaticComponents';
import CharacterForm from '../CharacterForm';
import * as S from './CharacterList.css';

const columns = [
  { title: 'Name', field: 'name', width: '40vw' },
  { title: 'Gender', field: 'gender', width: '30vw' },
  { title: 'Race', field: 'race', width: '30vw' },
];

const CharacterList = ({ getCharacters, characters, deleteCharacter }) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [race, setRace] = useState({ value: 'All', label: 'All' });
  const [gender, setGender] = useState({ value: 'All', label: 'All' });
  const [listToDisplay, setListToDisplay] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCharacter, setEditCharacter] = useState({});
  const [characterId, setCharacterId] = useState();
  const [searchedOnEnter, setSearchedOnEnter] = useState(false);

  const [openForm, handleClickOpenForm, handleCloseForm] = useToggle();

  const {
    page,
    rowsPerPage,
    resetPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = usePaginatedTable(pageSize, pageNumber);

  const { push } = useHistory();

  useEffect(() => {
    if (search !== '') {
      getCharacters(search);
    }
  }, [getCharacters, search]);

  useEffect(() => {
    if (!characters?.characters?.length && !searchedOnEnter) {
      setSearchedOnEnter(true);
      getCharacters('');
    }
  }, [getCharacters, characters, searchedOnEnter]);

  useEffect(() => {
    if (characters?.searched && search === '') {
      getCharacters('');
    }
  }, [getCharacters, characters, search]);

  useEffect(() => {
    if (
      characters?.characters.length !== 0 &&
      (race?.value === 'All' || race === null) &&
      (gender?.value === 'All' || gender === null)
    ) {
      setListToDisplay(characters?.characters);
    } else if (
      characters?.characters.length !== 0 &&
      (gender?.value === 'All' || gender === null)
    ) {
      setListToDisplay(
        ...[
          characters?.characters.filter(
            (character) => character.race === race.value,
          ),
        ],
      );
    } else if (
      characters?.characters.length !== 0 &&
      (race?.value === 'All' || race === null)
    ) {
      setListToDisplay(
        ...[
          characters?.characters.filter(
            (character) => character.gender === gender.value,
          ),
        ],
      );
    } else if (characters?.characters.length !== 0) {
      setListToDisplay(
        ...[
          characters?.characters.filter(
            (character) =>
              character.gender === gender.value &&
              character.race === race.value,
          ),
        ],
      );
    }
  }, [characters.characters, setListToDisplay, race, gender, characters]);

  useEffect(() => {
    setPageNumber(page);
    setPageSize(rowsPerPage);
  }, [page, rowsPerPage, setPageSize, setPageNumber]);

  const setDataSearch = (value) => {
    setSearch(value);
    if (resetPage) {
      resetPage();
    }
  };

  const handleRaceChange = (event) => {
    setRace(event);
  };

  const handleGenderChange = (event) => {
    setGender(event);
  };

  const addNewCharacter = () => {
    setEditMode(false);
    handleClickOpenForm();
  };

  const handleEditCharacter = (character) => {
    setCharacterId(character.id);
    setEditMode(true);
    setEditCharacter(character);
    handleClickOpenForm();
  };

  const handleDelete = async (id) => {
    const deleteConfirm = window.confirm(
      'Are you sure that you want to delete this character?',
    );
    if (deleteConfirm) {
      const response = deleteCharacter(id);
      response.then((res) => {
        if (res.error) {
          toast.error(<ErrorToast message={res.payload?.message} />);
        } else {
          toast.success(<SuccessToast message="Character has been deleted" />);
          getCharacters('');
        }
      });
    }
  };

  return (
    <S.Container>
      <Typography variant="h3">Characters</Typography>
      <S.SelectsContainer>
        <p>Filter by</p>
        <S.SelectContainer>
          Race
          <Select
            options={raceOptions}
            menuPortalTarget={document.body}
            isClearable
            isSearchable={true}
            name="raceSelect"
            placeholder="Select Race"
            styles={selectStyle}
            onChange={handleRaceChange}
            value={race}
          />
        </S.SelectContainer>
        <S.SelectContainer>
          Gender
          <Select
            options={genderOptions}
            menuPortalTarget={document.body}
            isClearable
            isSearchable={true}
            name="genderSelect"
            placeholder="Select Gender"
            styles={selectStyle}
            onChange={handleGenderChange}
            value={gender}
          />
        </S.SelectContainer>
      </S.SelectsContainer>
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
                  onClick={addNewCharacter}
                >
                  Add Character
                </Button>
              </Box>
            </Box>
          ),
        }}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        columns={columns}
        data={listToDisplay}
        onRowClick={(event, rowData) => {
          push(`/characters/${rowData.id}`);
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
            tooltip: 'Edit character',
            onClick: (event, rowData) => handleEditCharacter(rowData),
          },
          {
            icon: () => <DeleteIcon color="action" />,
            tooltip: 'Delete character',
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
        <CharacterForm
          editCharacter={editCharacter}
          editMode={editMode}
          handleClose={handleCloseForm}
          open
          id={characterId}
        />
      )}
    </S.Container>
  );
};

export default CharacterList;
