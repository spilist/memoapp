import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import penderMiddleware from 'redux-pender';
import configureMockStore from 'redux-mock-store';

const renderConnected = ({ path, store, ConnectedComponent }) => {
  let routingProps;
  const rendered = mount(
    <MemoryRouter initialEntries={[path]}>
      <Route
        render={props => {
          routingProps = props;
          return (
            <Provider store={store}>
              <ConnectedComponent {...props} />
            </Provider>
          );
        }}
      />
    </MemoryRouter>
  );

  return {
    routingProps,
    rendered,
  };
};

const renderWithRouter = ({ path, props, Component }) =>
  mount(
    <MemoryRouter initialEntries={[path]}>
      <Route
        render={routingProps => <Component {...routingProps} {...props} />}
      />
    </MemoryRouter>
  );

const renderSimple = ({ props, Component, deep = false }) => {
  const render = deep ? mount : shallow;
  return render(<Component {...props} />, { lifecycleExperimental: true });
};

const toJS = obj => JSON.parse(JSON.stringify(obj));

const range = num => new Array(num).fill().map((v, i) => i + 1);

// https://gist.github.com/solenoid/1372386
const mongoObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function() {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

const mockStore = state => configureMockStore([penderMiddleware()])(state);

export default {
  renderConnected,
  renderWithRouter,
  renderSimple,
  toJS,
  range,
  mongoObjectId,
  mockStore,
};
