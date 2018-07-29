import { Record } from 'immutable';

const SampleRecord = Record({});

export default class MockData {
  props = SampleRecord();

  constructor(options = {}) {
    this.setProps(options);
  }

  get() {
    return this.props;
  }

  _setProp(key, val) {
    const keys = Object.keys(this.props.toJS());
    if (!keys.includes(key)) {
      console.error(`${key} is not a valid key.`);
      return null;
    }

    this.props = this.props.set(key, val);
    return this.props;
  }

  setProps(props = {}) {
    Object.keys(props).forEach(key => {
      this._setProp(key, props[key]);
    });

    return this.props;
  }
}
