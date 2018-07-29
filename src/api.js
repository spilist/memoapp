import constants from '~/constants.js';
import { get, post, put, del } from '~/utils/WebRequestUtils';

const END_POINTS = constants.endPoints;

export function listMemos() {
  return get(END_POINTS.memo.list);
}

export function getMemo(memoId) {
  return get(END_POINTS.memo.get, {
    id: memoId,
  });
}

export function updateMemo(params) {
  return put(
    END_POINTS.memo.update,
    {
      id: params.id,
    },
    {
      title: params.title,
      content: params.content,
    }
  );
}
