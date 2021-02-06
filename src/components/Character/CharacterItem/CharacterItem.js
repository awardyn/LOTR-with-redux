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
  deleteCharacter,
  deleteQuote,
  getCharacterQuotes,
  getCharacters,
} from '../../../store/actions';
import {
  characterSelector,
  charactersSelector,
} from '../../../store/selectors';
import { usePaginatedTable, useToggle } from '../../../utils/hooks';
import QuoteForm from '../../Quote/QuoteForm';
import { ErrorToast, SuccessToast, Table } from '../../StaticComponents';
import CharacterForm from '../CharacterForm';
import * as S from './CharacterItem.css';

const columns = [{ title: 'Dialog', field: 'dialog' }];

const CharacterItem = ({
  character,
  characterQuotes,
  getCharacterQuotes,
  match,
  characters,
  getCharacters,
  deleteCharacter,
  deleteQuote,
}) => {
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
    if (!character && characters.length > 0) {
      toast.error(
        <ErrorToast message={`Character of given id does not exists`} />,
      );
      push('/characters');
    } else if (characters.length === 0) {
      getCharacters('');
    }
  }, [character, push, getCharacters, characters]);

  useEffect(() => {
    if (!!character) {
      getCharacterQuotes(paramId);
    }
  }, [getCharacterQuotes, paramId, character]);

  useEffect(() => {
    setPageNumber(page);
    setPageSize(rowsPerPage);
  }, [page, rowsPerPage, setPageSize, setPageNumber]);

  const handleDelete = async () => {
    const deleteConfirm = window.confirm(
      'Are you sure that you want to delete this character?',
    );
    if (deleteConfirm) {
      const response = deleteCharacter(character.id);
      response
        .then((res) => {
          if (res.error) {
            toast.error(<ErrorToast message={res.payload?.message} />);
          } else {
            toast.success(
              <SuccessToast message="Character has been deleted" />,
            );
            getCharacters('');
          }
        })
        .finally(() => {
          push('/characters');
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
          getCharacterQuotes(paramId);
        }
      });
    }
  };

  return (
    <>
      <S.Container>
        <Typography variant="h2">{character?.name}</Typography>
        <Typography variant="h4">
          Race:{' '}
          {character?.race !== 'NaN' && !!character?.race
            ? character?.race
            : 'Unknown'}
        </Typography>
        <Typography variant="h4">
          Gender:{' '}
          {character?.gender !== 'NaN' && !!character?.gender
            ? character?.gender
            : 'Unknown'}
        </Typography>
        <Typography variant="h4">
          Death:{' '}
          {character?.death !== 'NaN' && !!character?.death
            ? character?.death
            : 'Unknown'}
        </Typography>
        {character?.spouse !== 'NaN' && !!character?.spouse && (
          <Typography variant="h4">Spouse: {character?.spouse}</Typography>
        )}
        {character?.realm !== 'NaN' && !!character?.realm && (
          <Typography variant="h4">Realm: {character?.realm}</Typography>
        )}
        {character?.wikiurl !== 'NaN' &&
          !!character?.wikiurl &&
          !!character?.wikiurl !== 'undefined' && (
            <Button variant="contained" color="primary">
              <S.Link
                target="_blank"
                rel="noopener noreferrer"
                href={character?.wikiurl ?? '/characters'}
              >
                Go to wiki
              </S.Link>
            </Button>
          )}
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
        <Typography variant="h3">Character Quotes</Typography>
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
          onRowClick={(event, rowData) => {
            push(`/quotes/${rowData.id}`);
          }}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          columns={columns}
          data={characterQuotes}
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
        />
      </S.TableContainer>
      {openForm && (
        <CharacterForm
          id={character.id}
          editCharacter={character}
          editMode={true}
          handleClose={handleCloseForm}
          open
        />
      )}
      {openQuoteForm && (
        <QuoteForm
          character={character}
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
  const characterSelectorInstance = characterSelector();
  return {
    character: characterSelectorInstance(state, ownProps.match.params.id),
    characterQuotes: charactersSelector(state).characterQuotes,
    characters: charactersSelector(state).characters,
  };
};

export default connect(mapStateToProps, {
  getCharacterQuotes,
  getCharacters,
  deleteCharacter,
  deleteQuote,
})(CharacterItem);
