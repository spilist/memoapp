import React from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import oc from 'open-color-js';
import FontFaceObserver from 'fontfaceobserver';
import history from './history';
import store from './store';
import Root from './components/Root';
import { ScrollToTop } from './components/common';
import registerServiceWorker from './registerServiceWorker';

moment.locale('ko');

/* eslint-disable */
injectGlobal`
  html,
  body,
  #root,
  .root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: 'Apple SD Gothic Neo', Dotum, Arial, sans-serif;
    background: color('white');
    box-sizing: border-box;
    font-size: rem(14px);
    min-height: 100vh;
  }

  body[spoqa-han-sans-loaded] {
    font-family: 'Spoqa Han Sans', 'Apple SD Gothic Neo', Dotum, Arial, sans-serif;
  }

  * {
    box-sizing: inherit;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  .root {
    min-width: 700px;
    
    a {
      color: ${oc.gray8};
    }

    a:hover {
      color: ${oc.gray6};
    }

    a:focus {
      text-decoration: none;
    }
  }
`;
/* eslint-enable */

new FontFaceObserver('Spoqa Han Sans').load(null, 5 * 1000).then(() => {
  document.body.setAttribute('spoqa-han-sans-loaded', true);
});

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
