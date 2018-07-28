import { combineReducers } from 'redux';
import { penderReducer as pender } from 'redux-pender';
import memoList from './memoList';

export default combineReducers({
  memoList,
  pender,
});
