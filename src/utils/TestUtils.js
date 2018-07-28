import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';

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
  return render(<Component {...props} />);
};

const toJS = obj => JSON.parse(JSON.stringify(obj));

export default {
  renderConnected,
  renderWithRouter,
  renderSimple,
  toJS,
};
