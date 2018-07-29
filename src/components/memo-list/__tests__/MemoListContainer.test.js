import React from 'react';
import { List } from 'immutable';
import utils from '~/utils/TestUtils';
import Memo, { generateMemos } from '~/__mockdata__/Memo';
import ConnectedMemoListContainer, {
  MemoListContainer,
} from '../MemoListContainer';
import history from '~/history';

jest.mock('../MemoList', () => props => (
  <div id="MemoList" props={props}>
    MemoList
  </div>
));

let path, store, ownProps, simpleProps, state, component;
beforeEach(() => {
  path = '/all';
  ownProps = {};
  simpleProps = {};
  state = {
    memoList: {
      memos: List(),
    },
    pender: {
      pending: {},
    },
  };
  store = utils.mockStore(state);
});

const render = () =>
  utils.renderConnected({
    path,
    ownProps,
    store,
    ConnectedComponent: ConnectedMemoListContainer,
  });

const renderSimple = () =>
  utils.renderSimple({
    props: simpleProps,
    Component: MemoListContainer,
  });

const renderWithRouter = () =>
  utils.renderWithRouter({
    path,
    props: simpleProps,
    Component: MemoListContainer,
  });

describe('[MemoListContainer]', () => {
  describe('when path does not have memoSlug', () => {
    describe('when mounted', () => {
      it('redirects to the first memo if memos exist', () => {
        path = '/all';
        simpleProps = {
          label: 'all',
          memos: List([
            new Memo({
              _id: 'blahblah',
              title: 'Some random word',
            }).get(),
            ...generateMemos(15),
          ]),
        };
        renderWithRouter();
        expect(history.replace).toBeCalledWith({
          pathname: '/all/some-random-word--blahblah',
        });
      });
    });
  });

  describe('when props.label === "all"', () => {
    beforeEach(() => {
      ownProps.label = 'all';
    });

    it('provides labelName as "전체" and memos as whole memos, which is reverse sorted by updatedAt to MemoList component', () => {
      state.memoList.memos = List(generateMemos(15));
      component = render();
      const MemoList = component.find('#MemoList');
      expect(MemoList.prop('props').labelName).toBe('전체');
      expect(MemoList.prop('props').memos).toEqual(
        state.memoList.memos.sort((a, b) => {
          return a.updatedAt < b.updatedAt ? -1 : 1;
        })
      );
    });
  });
});
