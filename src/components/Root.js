import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as memoListActions from '~/store/modules/memoList';
import { Spinner } from './common';
import MemoListcontainer from './memo-list/MemoListContainer';

export class Root extends Component {
  componentDidMount() {
    const { MemoListActions } = this.props;
    MemoListActions.listAllMemos();
  }

  render() {
    const { loading } = this.props;
    return loading ? (
      <Spinner />
    ) : (
      <div className="root">
        <Switch>
          <Route exact path="/" render={() => <Redirect replace to="/all" />} />
          <Route path="/all" render={() => <MemoListcontainer label="all" />} />
          <Route
            path="/untagged"
            render={() => <MemoListcontainer label="none" />}
          />
          <Route
            path="/:labelSlug"
            render={({ match }) => {
              const { labelSlug } = match.params;
              const isLabelIdExist = labelSlug.indexOf('--') !== -1;
              return isLabelIdExist ? (
                <MemoListcontainer label={labelSlug.split('--').pop()} />
              ) : (
                <Redirect replace to="/all" />
              );
            }}
          />
        </Switch>
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
