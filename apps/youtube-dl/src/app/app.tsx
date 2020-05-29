import React, { useRef, useState } from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider, useApolloClient } from '@apollo/react-hooks';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createMuiTheme,
  CssBaseline,
  Modal,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {
  useDownloadSubscription,
  useStartDownloadMutation,
} from './operations/operations';
import { createHttpLink, HttpLink } from 'apollo-link-http';
import { ApolloLink, split } from 'apollo-link';
import { start } from 'repl';
import { Downloader } from './downloader';
import { getMainDefinition } from 'apollo-utilities';
import * as uuid from 'uuid';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const id = uuid.v4();

export const App = () => {
  const wsLink = new WebSocketLink(
    new SubscriptionClient(
      location.origin.replace(/^http/, 'ws') + '/graphql',
      {
        reconnect: true,
        timeout: 3000,
      }
    )
  );

  const httpLink = new HttpLink({
    uri: '/graphql',
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const cl = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={cl}>
        <CssBaseline />
        <Downloader id={id} />
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default App;
