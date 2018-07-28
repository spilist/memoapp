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
        </Switch>
      </div>
    );
  }
}

export default Root;
