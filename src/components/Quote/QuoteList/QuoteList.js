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
import QuoteForm from '../QuoteForm';
import * as S from '../../Styles.css';

const columns = [{ title: 'Dialog', field: 'dialog' }];

const QuoteList = ({ getQuotes, quotes, deleteQuote }) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editQuote, setEditQuote] = useState({});
  const [searchedOnEnter, setSearchedOnEnter] = useState(false);

  const [openForm, handleClickOpenForm, handleCloseForm] = useToggle();

  const { push } = useHistory();

  useEffect(() => {
    if (search !== '') {
      getQuotes(search);
    }
  }, [getQuotes, search]);

  useEffect(() => {
    if (!quotes?.quotes?.length && !searchedOnEnter) {
      setSearchedOnEnter(true);
      getQuotes('');
    }
  }, [getQuotes, quotes, searchedOnEnter]);

  useEffect(() => {
    if (quotes?.searched && search === '') {
      getQuotes('');
    }
  }, [getQuotes, quotes, search]);

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

  const addNewQuote = () => {
    setEditMode(false);
    handleClickOpenForm();
  };

  const handleEditQuote = (quote) => {
    setEditMode(true);
    setEditQuote(quote);
    handleClickOpenForm();
  };

  const handleDelete = async (id) => {
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
          getQuotes('');
        }
      });
    }
  };

  return (
    <>
      <S.TableContainer>
        <Typography variant="h3">Quotes</Typography>
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
          data={quotes?.quotes}
          onRowClick={(event, rowData) => {
            push(`/quotes/${rowData.id}`);
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
              tooltip: 'Edit quote',
              onClick: (event, rowData) => {
                handleEditQuote(rowData);
              },
            },
            {
              icon: () => <DeleteIcon color="action" />,
              tooltip: 'Delete quote',
              onClick: (event, rowData) => handleDelete(rowData.id),
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
        <QuoteForm
          editQuote={editQuote}
          editMode={editMode}
          handleClose={handleCloseForm}
          open
        />
      )}
    </>
  );
};

export default QuoteList;
