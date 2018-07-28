import React from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import history from './history';
import store from './store';
import Root from './components/Root';
import { ScrollToTop } from './components/common';
import registerServiceWorker from './registerServiceWorker';

moment.locale('ko');

const RouteDeliverer = ({ match, location }) => (
  <Provider store={store}>
    <ScrollToTop>
      <Root match={match} location={location} />
    </ScrollToTop>
  </Provider>
);

import('./imports').then(() => {
  render(
    <Router history={history}>
      <Route path="/" component={RouteDeliverer} />
    </Router>,
    document.getElementById('root')
  );
  registerServiceWorker();
});
