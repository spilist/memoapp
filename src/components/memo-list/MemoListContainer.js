import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
    this.openMemo(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.redirect(this.props);
      this.openMemo(this.props);
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

  openMemo = props => {
    const { location, MemoListActions } = props;
    const match = matchPath(location.pathname, {
      path: '/:labelSlug/:memoSlug',
      exact: true,
    });

    if (match && match.params && match.params.memoSlug) {
      const { memoSlug } = match.params;
      if (memoSlug === 'new') {
      } else {
        const memoId = textUtils.getId(memoSlug);
        if (!memoId) {
          return;
        }
        MemoListActions.openMemo(memoId);
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
    openedMemo: memoList.openedMemo,
    openingMemo: pender.pending[memoListActions.OPEN_MEMO],
  }),
  dispatch => ({
    MemoListActions: bindActionCreators(memoListActions, dispatch),
  })
)(MemoListContainer);
