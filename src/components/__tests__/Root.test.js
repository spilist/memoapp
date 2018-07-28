import utils from '~/utils/TestUtils';
import Root from '../Root';

let path, props, component;
beforeEach(() => {
  path = '/';
  props = {};
});

const render = () =>
  utils.renderWithRouter({
    path,
    props,
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

    it('renders MemoListContainer with label="all" prop', () => {
      component = render();
      const container = component.find('MemoListContainer');
      expect(container.prop('label')).toBe('all');
    });
  });

  describe('when path is /untagged', () => {
    beforeEach(() => {
      path = '/untagged';
    });

    it('renders MemoListContainer with label="none" prop', () => {
      component = render();
      const container = component.find('MemoListContainer');
      expect(container.prop('label')).toBe('none');
    });
  });

  describe('when path is /:labelSlug', () => {
    it('renders MemoListContainer with label=":labelId" prop when path is in correct form', () => {
      path = '/some-label-slug-17';
      component = render();
      const container = component.find('MemoListContainer');
      expect(container.prop('label')).toBe(17);
    });

    it('redirects to /all when path is not in correct form', () => {
      path = '/some-label-slug-xx';
      component = render();
      let redirect = component.find('.Redirect');
      expect(redirect.prop('to')).toBe('/all');
      expect(redirect.prop('replace')).toBe('true');

      path = '/some-label-slug-x34x';
      component = render();
      redirect = component.find('.Redirect');
      expect(redirect.prop('to')).toBe('/all');
      expect(redirect.prop('replace')).toBe('true');
    });
  });
});
