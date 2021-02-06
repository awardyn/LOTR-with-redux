import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Typography } from '@material-ui/core';
import { deleteQuote,getQuotes } from '../../../store/actions';
import {
  charactersSelector,
  moviesSelector,
  quoteSelector,
  quotesSelector,
} from '../../../store/selectors';
import { useToggle } from '../../../utils/hooks';
import { ErrorToast, SuccessToast } from '../../StaticComponents';
import QuoteForm from '../QuoteForm';
import * as S from './QuoteItem.css';

const QuoteItem = ({ quote, match, getQuotes, quotes, deleteQuote }) => {
  const { push } = useHistory();

  const [openForm, handleClickOpenForm, handleCloseForm] = useToggle();

  useEffect(() => {
    if (!quote && quotes.quotes.length > 0) {
      toast.error(<ErrorToast message={`quote of given id does not exists`} />);
      push('/quotes');
    } else if (quotes.quotes.length === 0) {
      getQuotes('');
    }
  }, [quote, push, getQuotes, quotes]);

  const handleDelete = async () => {
    const deleteConfirm = window.confirm(
      'Are you sure that you want to delete this quote?',
    );
    if (deleteConfirm) {
      const response = deleteQuote(quote.id);
      response
        .then((res) => {
          if (res.error) {
            toast.error(<ErrorToast message={res.payload?.message} />);
          } else {
            toast.success(<SuccessToast message="Quote has been deleted" />);
            getQuotes('');
          }
        })
        .finally(() => {
          push('/quotes');
        });
    }
  };

  return (
    <S.Container>
      <Typography variant="h2">{quote?.dialog}</Typography>
      <Typography variant="h4">Said by: {quote?.charactername}</Typography>
      <Typography variant="h4">In movie: {quote?.moviename}</Typography>
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
      {openForm && (
        <QuoteForm
          editQuote={quote}
          editMode={true}
          handleClose={handleCloseForm}
          open
        />
      )}
    </S.Container>
  );
};

const mapStateToProps = (state, ownProps) => {
  const quoteSelectorInstance = quoteSelector();
  return {
    quotes: quotesSelector(state),
    quote: quoteSelectorInstance(state, ownProps.match.params.id),
    movies: moviesSelector(state),
    characters: charactersSelector(state),
  };
};

export default connect(mapStateToProps, { getQuotes, deleteQuote })(QuoteItem);
