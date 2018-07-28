import React from 'react';
import utils from '~/utils/TestUtils';
import Root from '../Root';
import store from '~/store';

jest.mock('../memo-list/MemoListContainer', () => props => (
  <div id="MemoListContainer" props={props}>
    MemoListContainer
  </div>
));

let path, component;
beforeEach(() => {
  path = '/';
});

const render = () =>
  utils.renderConnected({
    path,
    store,
    ConnectedComponent: Root,
  }).rendered;

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

    it('renders MemoListContainer with label="all" prop', () => {
      component = render();
      const container = component.find('#MemoListContainer');
      expect(container.prop('props').label).toBe('all');
    });
  });

  describe('when path is /untagged', () => {
    beforeEach(() => {
      path = '/untagged';
    });

    it('renders MemoListContainer with label="none" prop', () => {
      component = render();
      const container = component.find('#MemoListContainer');
      expect(container.prop('props').label).toBe('none');
    });
  });

  describe('when path is /:labelSlug', () => {
    it('renders MemoListContainer with label=":labelId" prop when path is in correct form', () => {
      const mongoId = utils.mongoObjectId();
      path = `/some-label-slug--${mongoId}`;
      component = render();
      const container = component.find('#MemoListContainer');
      expect(container.prop('props').label).toBe(mongoId);
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
});
