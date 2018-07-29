import { createAction, handleActions } from 'redux-actions';
import { Record, Map, List } from 'immutable';
import { pender } from 'redux-pender';
import * as api from '~/api';

export const LIST_ALL_MEMOS = 'memoList/LIST_ALL_MEMOS';
export const OPEN_MEMO = 'memoList/OPEN_MEMO';

export const listAllMemos = createAction(LIST_ALL_MEMOS, () => api.listMemos());
export const openMemo = createAction(OPEN_MEMO, memoId => api.getMemo(memoId));

export const Memo = Record({
  _id: '',
  updatedAt: null,
  createdAt: null,
  title: '',
  content: '',
});

const initialState = Record({
  memos: List(),
  openedMemo: null,
})();

export default handleActions(
  {
    ...pender({
      type: LIST_ALL_MEMOS,
      onSuccess: (state, { payload: response }) => {
        return state.merge(
          Map({
            memos: List(response.data.map(data => Memo(data))),
          })
        );
      },
    }),
    ...pender({
      type: OPEN_MEMO,
      onSuccess: (state, { payload: response }) => {
        const opened = Memo(response.data);
        const index = state.memos.findIndex(memo => memo._id === opened._id);
        const memos =
          index === -1
            ? state.memos.push(opened)
            : state.memos.set(index, opened);

        return state.merge(
          Map({
            memos: memos,
            openedMemo: opened,
          })
        );
      },
    }),
  },
  initialState
);
