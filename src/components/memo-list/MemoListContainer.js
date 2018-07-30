import React, { Component } from 'react';
import { List } from 'immutable';
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
      return {
        title: '전체',
      };
    default:
      return labels.find(l => l._id === labelId);
  }
};

const getMemos = (memos, labels, labelId) => {
  switch (labelId) {
    case 'all':
      return memos.sort(sortUtils.byUpdatedAt);
    default:
      const label = getLabel(labels, labelId);
      return label
        ? memos
            .filter(memo => label.memoIds.includes(memo._id))
            .sort(sortUtils.byUpdatedAt)
        : List();
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
    const { memos, location, labels } = props;
    const match = matchPath(location.pathname, {
      path: '/:labelSlug',
      exact: true,
    });

    if (match && match.params && match.params.labelSlug) {
      const { labelSlug } = match.params;
      const labelId = textUtils.getId(labelSlug);
      const label = getLabel(labels, labelId);
      if (!label && labelSlug !== 'all') {
        history.replace({
          pathname: `/all`,
          search: location.search,
        });
      } else if (memos.size > 0) {
        history.replace({
          pathname: `/${match.params.labelSlug}/${textUtils.slug(
            memos.first()
          )}`,
          search: location.search,
        });
      }
    }
  };

  openMemo = props => {
    const { location, MemoListActions, labels } = props;
    const match = matchPath(location.pathname, {
      path: '/:labelSlug/:memoSlug',
      exact: true,
    });

    if (match && match.params && match.params.memoSlug) {
      const { labelSlug, memoSlug } = match.params;
      const labelId = textUtils.getId(labelSlug);
      const label = getLabel(labels, labelId);
      if (label || labelSlug === 'all') {
        const memoId = textUtils.getId(memoSlug);
        if (!memoId) {
          history.replace({
            pathname: `/${label}`,
            search: location.search,
          });
        } else {
          MemoListActions.openMemo(memoId);
        }
      } else {
        history.replace({
          pathname: `/all`,
          search: location.search,
        });
      }
    } else {
      MemoListActions.openMemo(null);
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
    memos: getMemos(memoList.memos, labelList.labels, labelId),
    allMemosSize: memoList.memos.size,
    openedMemo: memoList.openedMemo,
    openingMemo: pender.pending[memoListActions.OPEN_MEMO],
  }),
  dispatch => ({
    MemoListActions: bindActionCreators(memoListActions, dispatch),
    LabelListActions: bindActionCreators(labelListActions, dispatch),
  })
)(MemoListContainer);
