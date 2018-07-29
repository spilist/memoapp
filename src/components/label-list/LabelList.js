import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Checkbox, List as AntList, Button } from 'antd';
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';
import history from '~/history';

const Container = styled.div`
  padding: 0.5rem;
  flex: 0 0 8rem;
  height: 100%;
  background-color: ${oc.gray1};
  border-right: 2px solid ${oc.gray4};
  overflow: auto;
`;

const IconButton = styled.div`
  color: ${oc.gray8};
  padding: 2px 4px;
  cursor: pointer;
  background-color: ${props => (props.active ? oc.gray2 : 'transparent')};
  &:hover {
    color: ${oc.gray6};
    background-color: ${props => (props.active ? oc.gray2 : oc.gray1)};
  }
`;

const HeaderTitle = styled(Link)`
  font-size: 14px;
  font-weight: bold;
`;

const getState = props => ({});

export default class MemoList extends Component {
  state = getState(this.props);

  renderHeader = () => {
    return 'header';
    // return <Flex>
    //   <HeaderTitle to='all'>
    //     {`전체 (${memos.size})`}
    //   </HeaderTitle>
    // </Flex>;
  };

  renderList = () => {
    return 'list';
  };

  render() {
    return (
      <Container>
        {this.renderHeader()}
        {this.renderList()}
      </Container>
    );
  }
}
