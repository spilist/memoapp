import React from 'react';
import * as original from 'react-router-dom';
module.exports = {
  ...original,
  Redirect: jest
    .fn()
    .mockImplementation(({ replace, ...props }) => (
      <div
        replace={replace ? 'true' : 'false'}
        {...props}
        className="Redirect"
      />
    )),
};
