import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {SnackbarProvider} from 'notistack';

import './index.css'

import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_TOURNAMENT_API_URL,
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <SnackbarProvider maxSnack={1} autoHideDuration={3000} anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}>
      <App />
    </SnackbarProvider>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
