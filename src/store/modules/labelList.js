import { createAction, handleActions } from 'redux-actions';
import { Record, Map, List } from 'immutable';
import { pender } from 'redux-pender';
import * as api from '~/api';

export const LIST_ALL_LABELS = 'labelList/LIST_ALL_LABELS';
export const CREATE_NEW_LABEL = 'labelList/CREATE_NEW_LABEL';

export const listAllLabels = createAction(LIST_ALL_LABELS, () =>
  api.listLabels()
);
export const createNewLabel = createAction(CREATE_NEW_LABEL, () =>
  api.createLabel({
    title: '새 라벨',
  })
);

export const Label = Record({
  _id: '',
  updatedAt: null,
  createdAt: null,
  title: '',
  memoIds: List(), // list of memo ids
});

const initialState = Record({
  labels: List(),
})();

export default handleActions(
  {
    ...pender({
      type: CREATE_NEW_LABEL,
      onSuccess: (state, { payload: response }) => {
        const created = Label({
          ...response.data,
          memoIds: List(),
        });
        return state.merge(
          Map({
            labels: state.labels.push(created),
          })
        );
      },
    }),
    ...pender({
      type: LIST_ALL_LABELS,
      onSuccess: (state, { payload: response }) => {
        return state.merge(
          Map({
            labels: List(
              response.data.map(data =>
                Label({
                  ...data,
                  memoIds: List(data.memos),
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
