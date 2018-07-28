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
});
