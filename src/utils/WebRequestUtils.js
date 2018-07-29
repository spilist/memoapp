import axios from 'axios';
import Configs from '~/configs.js';

const SERVER_URL = Configs.server.url;

function _requestUrl(endPoint, namedParams, userParams) {
  let endPointUrl = endPoint;
  Object.keys(namedParams).forEach(key => {
    endPointUrl = endPointUrl.replace(`:${key}`, namedParams[key]);
  });

  return `${SERVER_URL}${endPointUrl}`;
}

function _request(method, url, data) {
  return axios({
    method: method,
    headers: {
      Accept: 'application/json',
    },
    params: method === 'GET' ? data : {},
    data: method !== 'GET' ? data : {},
    url,
  });
}

export function get(endPoint, namedParams = {}, userParams = {}) {
  return _request('GET', _requestUrl(endPoint, namedParams), userParams);
}

export function post(endPoint, namedParams = {}, userParams = {}) {
  return _request('POST', _requestUrl(endPoint, namedParams), userParams);
}

export function put(endPoint, namedParams = {}, userParams = {}) {
  return _request('PUT', _requestUrl(endPoint, namedParams), userParams);
}

export function del(endPoint, namedParams = {}, userParams = {}) {
  return _request('DELETE', _requestUrl(endPoint, namedParams), userParams);
}
