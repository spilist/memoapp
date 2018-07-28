import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';
import modules from './modules';

const configure = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Apply redux devtools only in development mode
  const composeEnhancers = isDevelopment
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

  const middlewares = [penderMiddleware()];

  const store = createStore(
    modules,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  return store;
};

export default configure;
