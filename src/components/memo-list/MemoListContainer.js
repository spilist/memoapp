import React, { Component } from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import textUtils from '~/utils/TextUtils';
import sortUtils from '~/utils/SortUtils';
import * as memoListActions from '~/store/modules/memoList';
import MemoList from './MemoList';
import history from '~/history';

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
      return memoListState.memos.sort(sortUtils.byUpdatedAt);
  }
};

export class MemoListContainer extends Component {
  componentDidMount() {
    this.redirect(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.redirect(this.props);
    }
  }

  redirect = props => {
    const { memos, location } = props;
    const match = matchPath(location.pathname, {
      path: '/:labelSlug',
      exact: true,
    });

    if (match && match.params && match.params.labelSlug) {
      if (memos.size > 0) {
        history.replace({
          pathname: `/${match.params.labelSlug}/${textUtils.slug(
            memos.first()
          )}`,
        });
      }
    }
  };

  render() {
    return <MemoList {...this.props} />;
  }
}

export default connect(
  ({ memoList, pender }, { label }) => ({
    labelName: labelName(label),
    memos: memos(label, memoList),
  }),
  dispatch => ({})
)(MemoListContainer);
