import { Record } from 'immutable';
import faker from 'faker';
import MockData from './MockData';
import utils from '~/utils/TestUtils';

const MemoRecord = Record({
  _id: '',
  updatedAt: null,
  createdAt: null,
  title: '',
  content: '',
});

export default class Memo extends MockData {
  props = MemoRecord();

  constructor(props) {
    super();
    this.setProps(props);
  }
}

export function generateMemos(num, props = {}) {
  faker.locale = 'ko';

  return utils.range(num).map(id =>
    new Memo({
      _id: utils.mongoObjectId(),
      updatedAt: faker.date.past(),
      createdAt: faker.date.past(),
      title: faker.lorem.words(),
      content: faker.lorem.text(),
      ...props,
    }).get()
  );
}
