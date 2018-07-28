import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

class Root extends Component {
  render() {
    return (
      <div className="root">
        <Switch>
          <Route exact path="/" render={() => <Redirect replace to="/all" />} />
        </Switch>
      </div>
    );
  }
}

export default Root;
