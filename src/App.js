import React from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import BookItem from './components/Book/BookItem';
import BookList from './components/Book/BookList';
import CharacterItem from './components/Character/CharacterItem';
import CharacterList from './components/Character/CharacterList';
import ImageView from './components/ImageView';
import Import from './components/Import';
import Main from './components/Main';
import MovieItem from './components/Movie/MovieItem';
import MovieList from './components/Movie/MovieList';
import Navbar from './components/Navbar';
import QuoteItem from './components/Quote/QuoteItem';
import QuoteList from './components/Quote/QuoteList';
import { ToastProvider } from './components/StaticComponents';
import {
  deleteBook,
  deleteCharacter,
  deleteMovie,
  deleteQuote,
  getBooks,
  getCharacters,
  getMovies,
  getQuotes,
  postImage,
  setupDefaultData,
} from './store/actions';
import {
  booksSelector,
  charactersSelector,
  moviesSelector,
  quotesSelector,
} from './store/selectors';
import './App.css';

function App({
  books,
  characters,
  movies,
  quotes,
  getBooks,
  getCharacters,
  getMovies,
  getQuotes,
  deleteMovie,
  deleteQuote,
  deleteCharacter,
  deleteBook,
  postImage,
  setupDefaultData,
}) {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <ToastProvider />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/import">
            <Import setupDefaultData={setupDefaultData} />
          </Route>
          <Route exact path="/image">
            <ImageView postImage={postImage} />
          </Route>
          <Route exact path="/books">
            <BookList
              books={books}
              getBooks={getBooks}
              deleteBook={deleteBook}
            />
          </Route>
          <Route exact path="/books/:id" component={BookItem} />
          <Route exact path="/characters">
            <CharacterList
              characters={characters}
              getCharacters={getCharacters}
              deleteCharacter={deleteCharacter}
            />
          </Route>
          <Route exact path="/characters/:id" component={CharacterItem} />
          <Route exact path="/movies">
            <MovieList
              movies={movies}
              getMovies={getMovies}
              deleteMovie={deleteMovie}
            />
          </Route>
          <Route exact path="/movies/:id" component={MovieItem} />
          <Route exact path="/quotes">
            <QuoteList
              quotes={quotes}
              getQuotes={getQuotes}
              deleteQuote={deleteQuote}
            />
          </Route>
          <Route exact path="/quotes/:id" component={QuoteItem} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    books: booksSelector(state),
    characters: charactersSelector(state),
    movies: moviesSelector(state),
    quotes: quotesSelector(state),
  };
};

export default connect(mapStateToProps, {
  getBooks,
  getCharacters,
  getMovies,
  getQuotes,
  deleteMovie,
  deleteQuote,
  deleteCharacter,
  deleteBook,
  postImage,
  setupDefaultData,
})(App);
