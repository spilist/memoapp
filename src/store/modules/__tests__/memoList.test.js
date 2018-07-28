import { Record, Map, List } from 'immutable';
import moxios from 'moxios';
import utils from '~/utils/TestUtils';
import { generateMemos } from '~/__mockdata__/Memo';
import Configs from '~/configs.js';
import memoList, { listAllMemos } from '../memoList';

const SERVER_URL = Configs.server.url;
const BASE = 'memoList';

const initialState = Record({
  memos: List(),
})();

let store, state, action;
beforeEach(() => {
  state = initialState;
  store = utils.mockStore(state);
  action = null;
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

describe('[memoList module]', () => {
  describe('listAllMemos()', () => {
    it('calls listMemos api and sets state', done => {
      const memos = generateMemos(15);
      store.dispatch(listAllMemos());
      action = store.getActions()[0];
      expect(action).toEqual({
        type: `${BASE}/LIST_ALL_MEMOS_PENDING`,
        meta: undefined,
      });
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        expect(request).toMatchObject({
          url: `${SERVER_URL}/memos`,
        });
        request
          .respondWith({
            status: 200,
            response: memos.map(memo => memo.toJS()),
          })
          .then(() => {
            // success
            action = store.getActions()[2];
            const before = memoList(state, action);
            const after = state.merge(
              Map({
                memos: List(memos),
              })
            );
            expect(before.toJS()).toEqual(after.toJS());
            done();
          });
      });
    });
  });
});
