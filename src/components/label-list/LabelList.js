import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Checkbox, List as AntList, Button } from 'antd';
import textUtils from '~/utils/TextUtils';
import history from '~/history';

const Container = styled.div`
  padding: 0.5rem;
  flex: 0 0 8rem;
  height: 100%;
  background-color: ${oc.gray1};
  border-right: 2px solid ${oc.gray4};
  overflow: auto;

  .ant-list-empty-text {
    padding: 1rem 0.5rem;
  }

  .ant-list-split .ant-list-item {
    border: 0;
  }

  .ant-list-item {
    padding: 0 4px;

    &:not(:last-of-type) {
      margin-bottom: 4px;
    }
  }
`;

const IconButton = styled.div`
  color: ${oc.gray8};
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

  color: ${props => props.active && oc.blue5} !important;
`;

const AntListItem = styled(AntList.Item)`
  cursor: pointer;
  transition: color 0.3s ease;
  color: ${props => props.active && oc.blue5} !important;

  &:hover {
    color: ${props => !props.active && oc.blue4};
  }
`;

const getState = props => ({});

export default class LabelList extends Component {
  state = getState(this.props);

  addLabel = () => {
    const { actions } = this.props;
    actions.createNewLabel().then(val => {
      history.push({
        pathname: `/${textUtils.slug(val.data)}}`,
      });
    });
  };

  renderHeader = () => {
    const { label, allMemosSize } = this.props;

    return (
      <Flex mb="0.5rem" justify="space-between">
        <HeaderTitle to="/all" active={label._id ? undefined : 'true'}>
          {`전체 (${allMemosSize})`}
        </HeaderTitle>
        <IconButton onClick={this.addLabel}>
          <i className="fa fa-plus" />
        </IconButton>
      </Flex>
    );
  };

  renderList = () => {
    const { label, labels } = this.props;
    return (
      <AntList
        itemLayout="horizontal"
        locale={{ emptyText: '라벨이 없습니다.' }}
        dataSource={labels}
        renderItem={item => (
          <AntListItem
            active={label._id === item._id ? 'true' : undefined}
            onClick={() => {
              history.push({
                pathname: `/${textUtils.slug(item)}`,
              });
            }}
          >
            {`${item.title} (${item.memoIds.size})`}
          </AntListItem>
        )}
      />
    );
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
