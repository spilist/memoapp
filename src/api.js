import constants from '~/constants.js';
import { get, post, put, del, delAll } from '~/utils/WebRequestUtils';

const END_POINTS = constants.endPoints;

export function listMemos() {
  return get(END_POINTS.memo.list);
}

export function listLabels() {
  return get(END_POINTS.label.list, {
    populate: false,
  });
}

export function createMemo(params) {
  return post(
    END_POINTS.memo.create,
    {},
    {
      title: params.title,
      content: params.content,
    }
  );
}

export function createLabel(params) {
  return post(
    END_POINTS.label.create,
    {},
    {
      title: params.title,
    }
  );
}

export function addMemosToLabel(params) {
  return post(
    END_POINTS.label.addMemos,
    { id: params.id },
    {
      memoIds: params.memoIds,
    }
  );
}

export function deleteMemosFromLabel(params) {
  return del(
    END_POINTS.label.deleteMemos,
    { id: params.id },
    {
      memoIds: params.memoIds,
    }
  );
}

export function getMemo(memoId) {
  return get(END_POINTS.memo.get, {
    id: memoId,
  });
}

export function deleteMemo(memoId) {
  return del(END_POINTS.memo.delete, {
    id: memoId,
  });
}

export function deleteLabel(labelId) {
  return del(END_POINTS.label.delete, {
    id: labelId,
  });
}

export function deleteMemos(memoIds) {
  return delAll(END_POINTS.memo.delete, memoIds);
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

export function updateLabel(params) {
  return put(
    END_POINTS.label.update,
    {
      id: params.id,
    },
    {
      title: params.title,
    }
  );
}
