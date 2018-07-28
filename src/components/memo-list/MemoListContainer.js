import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as memoListActions from '~/store/modules/memoList';

export class MemoListContainer extends Component {
  componentDidMount() {
    const { label, MemoListActions } = this.props;
    if (label === 'all') {
      return MemoListActions.listAllMemos();
    }
  }

  render() {
    return <div>MemoListContainer</div>;
  }
}

export default connect(
  ({ memoList, pender }) => ({
    memoList,
  }),
  dispatch => ({
    MemoListActions: bindActionCreators(memoListActions, dispatch),
  })
)(MemoListContainer);
