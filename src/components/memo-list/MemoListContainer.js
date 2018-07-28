import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as memoListActions from '~/store/modules/memoList';
import MemoList from './MemoList';

export class MemoListContainer extends Component {
  render() {
    return <MemoList {...this.props} />;
  }
}

const labelName = label => {
  switch (label) {
    case 'all':
    default:
      return '전체';
  }
};

const memos = (label, memoListState) => {
  switch (label) {
    case 'all':
    default:
      return memoListState.memos;
  }
};

export default connect(
  ({ memoList, pender }, { label }) => ({
    labelName: labelName(label),
    memos: memos(label, memoList),
    loading: pender.pending[memoListActions.LIST_ALL_MEMOS],
  }),
  dispatch => ({})
)(MemoListContainer);
