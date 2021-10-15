import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./index.css"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useParams,
  Link,
} from "react-router-dom";
import TagTable from './TagTable';


const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/test/images">
            <App />
          </Route>
          <Route path="/test/tags">
            <TagTable />
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);


