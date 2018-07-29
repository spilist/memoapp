import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { matchPath } from 'react-router';
import textUtils from '~/utils/TextUtils';
import sortUtils from '~/utils/SortUtils';
import * as memoListActions from '~/store/modules/memoList';
import * as labelListActions from '~/store/modules/labelList';
import MemoList from './MemoList';
import history from '~/history';

const getLabel = (labels, labelId) => {
  switch (labelId) {
    case 'all':
    default:
      return {
        title: '전체',
      };
  }
};

const getMemos = (memos, labelId) => {
  switch (labelId) {
    case 'all':
    default:
      return memos.sort(sortUtils.byUpdatedAt);
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
    const { location, MemoListActions, label } = props;
    const match = matchPath(location.pathname, {
      path: '/:labelSlug/:memoSlug',
      exact: true,
    });

    if (match && match.params && match.params.memoSlug) {
      const { memoSlug } = match.params;
      const memoId = textUtils.getId(memoSlug);
      if (!memoId) {
        history.replace({
          pathname: `/${label}`,
        });
        return;
      }
      MemoListActions.openMemo(memoId);
    }
  };

  render() {
    return <MemoList {...this.props} />;
  }
}

export default connect(
  ({ memoList, labelList, pender }, { labelId }) => ({
    labels: labelList.labels,
    label: getLabel(labelList.labels, labelId),
    memos: getMemos(memoList.memos, labelId),
    openedMemo: memoList.openedMemo,
    openingMemo: pender.pending[memoListActions.OPEN_MEMO],
  }),
  dispatch => ({
    MemoListActions: bindActionCreators(memoListActions, dispatch),
    LabelListActions: bindActionCreators(labelListActions, dispatch),
  })
)(MemoListContainer);
