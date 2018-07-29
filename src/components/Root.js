import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as memoListActions from '~/store/modules/memoList';
import textUtils from '~/utils/TextUtils';
import { Spinner } from './common';
import MemoListcontainer from './memo-list/MemoListContainer';

export class Root extends Component {
  componentDidMount() {
    const { MemoListActions } = this.props;
    MemoListActions.listAllMemos();
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
              render={props => <MemoListcontainer {...props} label="all" />}
            />
            <Route
              path="/untagged"
              render={props => <MemoListcontainer {...props} label="none" />}
            />
            <Route
              path="/:labelSlug"
              render={props => {
                const { labelSlug } = props.match.params;
                const id = textUtils.getId(labelSlug);
                return id ? (
                  <MemoListcontainer {...props} label={id} />
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
        ? pender.pending[memoListActions.LIST_ALL_MEMOS]
        : ownProps.loading,
  }),
  dispatch => ({
    MemoListActions: bindActionCreators(memoListActions, dispatch),
  })
)(Root);
