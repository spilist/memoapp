import { createAction, handleActions } from 'redux-actions';
import { Record, Map, List } from 'immutable';
import { pender } from 'redux-pender';
import * as api from '~/api';

export const LIST_ALL_MEMOS = 'memoList/LIST_ALL_MEMOS';
export const CREATE_NEW_MEMO = 'memoList/CREATE_NEW_MEMO';
export const OPEN_MEMO = 'memoList/OPEN_MEMO';
export const UPDATE_MEMO = 'memoList/UPDATE_MEMO';
export const DELETE_MEMO = 'memoList/DELETE_MEMO';

export const listAllMemos = createAction(LIST_ALL_MEMOS, () => api.listMemos());
export const createNewMemo = createAction(CREATE_NEW_MEMO, () =>
  api.createMemo({
    title: '새 메모',
  })
);
export const openMemo = createAction(OPEN_MEMO, memoId => memoId);
export const updateMemo = createAction(UPDATE_MEMO, params =>
  api.updateMemo(params)
);
export const deleteMemo = createAction(DELETE_MEMO, memoId =>
  api.deleteMemo(memoId)
);

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
    [OPEN_MEMO]: (state, { payload: memoId }) => {
      return state.set(
        'openedMemo',
        state.memos.find(memo => memo._id === memoId)
      );
    },
    ...pender({
      type: CREATE_NEW_MEMO,
      onSuccess: (state, { payload: response }) => {
        const created = Memo(response.data);
        return state.merge(
          Map({
            memos: state.memos.push(created),
          })
        );
      },
    }),
    ...pender({
      type: DELETE_MEMO,
      onSuccess: (state, { payload: response }) => {
        const deleted = Memo(response.data);
        const index = state.memos.findIndex(memo => memo._id === deleted._id);
        const memos = index === -1 ? state : state.memos.delete(index);

        return state.merge(
          Map({
            memos: memos,
            openedMemo: null,
          })
        );
      },
    }),
    ...pender({
      type: UPDATE_MEMO,
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
  },
  initialState
);
