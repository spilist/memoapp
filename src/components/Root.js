import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as memoListActions from '~/store/modules/memoList';
import * as labelListActions from '~/store/modules/labelList';
import textUtils from '~/utils/TextUtils';
import { Spinner } from './common';
import MemoListcontainer from './memo-list/MemoListContainer';

export class Root extends Component {
  componentDidMount() {
    const { MemoListActions, LabelListActions } = this.props;
    MemoListActions.listAllMemos();
    LabelListActions.listAllLabels();
  }

  render() {
    const { loading } = this.props;
    return (
      <div className="root">
        {loading !== false ? (
          <Spinner />
        ) : (
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Redirect replace to="/all" />}
            />
            <Route
              path="/all"
              render={props => <MemoListcontainer {...props} labelId="all" />}
            />
            <Route
              path="/:labelSlug"
              render={props => {
                const { labelSlug } = props.match.params;
                const id = textUtils.getId(labelSlug);
                return id ? (
                  <MemoListcontainer {...props} labelId={id} />
                ) : (
                  <Redirect replace to="/all" />
                );
              }}
            />
          </Switch>
        )}
      </div>
    );
  }
}

export default connect(
  ({ pender }, ownProps) => ({
    loading:
      ownProps.loading === undefined
        ? pender.pending[memoListActions.LIST_ALL_MEMOS] ||
          pender.pending[labelListActions.LIST_ALL_LABELS]
        : ownProps.loading,
  }),
  dispatch => ({
    MemoListActions: bindActionCreators(memoListActions, dispatch),
    LabelListActions: bindActionCreators(labelListActions, dispatch),
  })
)(Root);
