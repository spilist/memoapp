import React from 'react';
import moment from 'moment';

const ABSOLUTE_AFTER_DAYS = 7;

function _getFormat(momentValue) {
  const showYear = momentValue.year() !== moment().year();
  return showYear ? 'YYYY-MM-DD hh:mm:ss' : 'MM-DD hh:mm:ss';
}

function _getAbsolute(momentValue) {
  return momentValue.format(_getFormat(momentValue));
}

function _isAbsolute(momentValue) {
  const now = moment();
  const diff = Math.abs(momentValue.diff(now, 'days', true));

  return diff > ABSOLUTE_AFTER_DAYS;
}

function _representedValue(momentValue) {
  if (_isAbsolute(momentValue)) {
    return _getAbsolute(momentValue);
  }

  return momentValue.fromNow();
}

const format = time => {
  const momentValue = moment(time);
  return (
    <time title={_getAbsolute(momentValue)}>
      <b>{_representedValue(momentValue)}</b>
    </time>
  );
};

export default {
  format,
};
