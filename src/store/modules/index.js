import { combineReducers } from 'redux';
import { penderReducer as pender } from 'redux-pender';
import memoList from './memoList';
import labelList from './labelList';

export default combineReducers({
  memoList,
  labelList,
  pender,
});
