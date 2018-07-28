import utils from '~/utils/TestUtils';
import { MemoListContainer } from '../MemoListContainer';

let path, simpleProps, props, component;
beforeEach(() => {
  path = '/all';
  props = {};
  simpleProps = {
    MemoListActions: {
      listAllMemos: jest.fn(),
    },
  };
});

const render = () =>
  utils.renderWithRouter({
    path,
    props,
    Component: MemoListContainer,
  });

const renderSimple = () =>
  utils.renderSimple({
    props: simpleProps,
    Component: MemoListContainer,
  });

describe('[MemoListContainer]', () => {
  describe('when props.label === "all"', () => {
    beforeEach(() => {
      simpleProps.label = 'all';
    });

    describe('when mounted', () => {
      it('calls MemoListActions.listAllMemos()', () => {
        renderSimple();
        expect(simpleProps.MemoListActions.listAllMemos).toBeCalledWith();
      });
    });
  });
});
