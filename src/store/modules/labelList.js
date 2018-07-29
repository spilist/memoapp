import { createAction, handleActions } from 'redux-actions';
import { Record, Map, List } from 'immutable';
import { pender } from 'redux-pender';
import * as api from '~/api';

export const LIST_ALL_LABELS = 'labelList/LIST_ALL_LABELS';

export const listAllLabels = createAction(LIST_ALL_LABELS, () =>
  api.listLabels()
);

export const Label = Record({
  _id: '',
  updatedAt: null,
  createdAt: null,
  title: '',
  memos: List(), // list of memo ids
});

const initialState = Record({
  labels: List(),
})();

export default handleActions(
  {
    ...pender({
      type: LIST_ALL_LABELS,
      onSuccess: (state, { payload: response }) => {
        return state.merge(
          Map({
            labels: List(
              response.data.map(data =>
                Label({
                  ...data,
                  memos: List(data.memos),
                })
              )
            ),
          })
        );
      },
    }),
  },
  initialState
);
