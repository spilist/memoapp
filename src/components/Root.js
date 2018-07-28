import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MemoListcontainer from './memo-list/MemoListContainer';

class Root extends Component {
  render() {
    return (
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
              const labelId = parseInt(labelSlug.split('-').pop());
              return isNaN(labelId) ? (
                <Redirect replace to="/all" />
              ) : (
                <MemoListcontainer label={labelId} />
              );
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default Root;
