import React from 'react';
import { List } from 'immutable';
import utils from '~/utils/TestUtils';
import { generateMemos } from '~/__mockdata__/Memo';
import ConnectedMemoListContainer from '../MemoListContainer';

jest.mock('../MemoList', () => props => (
  <div id="MemoList" props={props}>
    MemoList
  </div>
));

let path, store, ownProps, state, component;
beforeEach(() => {
  path = '/all';
  ownProps = {};
  state = {
    memoList: {
      memos: List(generateMemos(15)),
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

describe('[MemoListContainer]', () => {
  describe('when props.label === "all"', () => {
    beforeEach(() => {
      ownProps.label = 'all';
    });

    it('provides labelName as "전체" and memos as whole memos, which is reverse sorted by updatedAt to MemoList component', () => {
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
