import { Record, Map, List } from 'immutable';
import moxios from 'moxios';
import utils from '~/utils/TestUtils';
import { generateMemos } from '~/__mockdata__/Memo';
import Configs from '~/configs.js';
import memoList, {
  Memo,
  listAllMemos,
  openMemo,
  updateMemo,
} from '../memoList';

const SERVER_URL = Configs.server.url;
const BASE = 'memoList';

const initialState = Record({
  memos: List(),
  openedMemo: null,
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
  // TODO: clarify why moxios not working properly
  // describe('updateMemo(params)', () => {
  //   it('calls updateMemo api and sets state', done => {
  //     const memo = generateMemos(1)[0];
  //     const memoId = memo._id;
  //     const newMemo = Memo({
  //       ...memo.toJS(),
  //       title: 'new title',
  //       content: 'new content',
  //     });
  //
  //     state = state.set('openedMemo', memo);
  //     store.dispatch(
  //       updateMemo({
  //         _id: memoId,
  //         title: newMemo.title,
  //         content: newMemo.content,
  //       })
  //     );
  //     action = store.getActions()[0];
  //     expect(action).toEqual({
  //       type: `${BASE}/UPDATE_MEMO_PENDING`,
  //       meta: undefined,
  //     });
  //
  //     moxios.wait(() => {
  //       let request = moxios.requests.mostRecent();
  //       expect(request).toMatchObject({
  //         method: 'PUT',
  //         url: `${SERVER_URL}/memos/${memoId}`,
  //       });
  //       request
  //         .respondWith({
  //           status: 200,
  //           response: newMemo.toJS(),
  //         })
  //         .then(() => {
  //           // success
  //           action = store.getActions()[2];
  //           const before = memoList(state, action);
  //           const after = state.merge(
  //             Map({
  //               openedMemo: newMemo,
  //             })
  //           );
  //           expect(before.toJS()).toEqual(after.toJS());
  //           done();
  //         });
  //     });
  //   });
  // });

  describe('openMemo(memoId)', () => {
    it('find memo by memoId and sets state', () => {
      const memos = generateMemos(10);
      const memo = memos[5];
      const memoId = memo._id;

      state = state.set('memos', List(memos));
      store.dispatch(openMemo(memoId));
      action = store.getActions()[0];
      expect(action).toEqual({
        type: `${BASE}/OPEN_MEMO`,
        payload: memoId,
      });
      expect(memoList(state, action).toJS()).toEqual(
        state
          .merge(
            Map({
              openedMemo: memo,
            })
          )
          .toJS()
      );
    });
  });

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
