import constants from '~/constants.js';
import { get, post } from '~/utils/WebRequestUtils';

const END_POINTS = constants.endPoints;

export function listMemos() {
  return get(END_POINTS.memo.list);
}
