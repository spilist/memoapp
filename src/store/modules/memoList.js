import { createAction, handleActions } from 'redux-actions';
import { Record, Map, List } from 'immutable';
import { pender } from 'redux-pender';
import * as api from '~/api';

const LIST_ALL_MEMOS = 'memoList/LIST_ALL_MEMOS';

export const listAllMemos = createAction(LIST_ALL_MEMOS, () => api.listMemos());

const Memo = Record({
  _id: '',
  updatedAt: null,
  createdAt: null,
  title: '',
  content: '',
});

const initialState = Record({
  memos: List(),
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
  },
  initialState
);
