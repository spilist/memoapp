import React from 'react';
import moxios from 'moxios';
import utils from '~/utils/TestUtils';
import ConnectedRoot, { Root } from '../Root';
import store from '~/store';

jest.mock('../memo-list/MemoListContainer', () => props => (
  <div id="MemoListContainer" props={props}>
    MemoListContainer
  </div>
));

let path, ownProps, simpleProps, component;
beforeEach(() => {
  path = '/';
  ownProps = {
    loading: false,
  };
  simpleProps = {
    loading: false,
    MemoListActions: {
      listAllMemos: jest.fn(),
    },
    LabelListActions: {
      listAllLabels: jest.fn(),
    },
  };
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

const render = () =>
  utils.renderConnected({
    path,
    ownProps,
    store,
    ConnectedComponent: ConnectedRoot,
  });

const renderSimple = () =>
  utils.renderSimple({
    props: simpleProps,
    Component: Root,
  });

describe('[Root]', () => {
  describe('when path is /', () => {
    it('redirects to /all', () => {
      component = render();
      const redirect = component.find('.Redirect');
      expect(redirect.prop('to')).toBe('/all');
      expect(redirect.prop('replace')).toBe('true');
    });
  });

  describe('when path is /all', () => {
    beforeEach(() => {
      path = '/all';
    });

    it('renders MemoListContainer with labelId="all" prop', () => {
      component = render();
      const container = component.find('#MemoListContainer');
      expect(container.prop('props').labelId).toBe('all');
    });
  });

  describe('when path is /:labelSlug', () => {
    it('renders MemoListContainer with labelId=":labelId" prop when path is in correct form', () => {
      const mongoId = utils.mongoObjectId();
      path = `/some-label-slug--${mongoId}`;
      component = render();
      const container = component.find('#MemoListContainer');
      expect(container.prop('props').labelId).toBe(mongoId);
    });

    it('redirects to /all when path is not in correct form', () => {
      const mongoId = utils.mongoObjectId();
      path = `/some-label-slug-${mongoId}`;
      component = render();
      let redirect = component.find('.Redirect');
      expect(redirect.prop('to')).toBe('/all');
      expect(redirect.prop('replace')).toBe('true');
    });
  });

  describe('when mounted', () => {
    it('calls MemoListActions.listAllMemos()', () => {
      renderSimple();
      expect(simpleProps.MemoListActions.listAllMemos).toBeCalledWith();
    });

    it('calls LabelListActions.listAllLabels()', () => {
      renderSimple();
      expect(simpleProps.LabelListActions.listAllLabels).toBeCalledWith();
    });
  });
});
