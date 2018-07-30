import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex } from 'reflexbox';
import { Button, List as AntList } from 'antd';
import textUtils from '~/utils/TextUtils';
import history from '~/history';

const IconButton = styled.div`
  color: ${oc.gray8};
  cursor: pointer;
  background-color: ${props => (props.active ? oc.gray2 : 'transparent')};
  &:hover {
    color: ${oc.gray6};
    background-color: ${props => (props.active ? oc.gray2 : oc.gray1)};
  }
`;

const ItemButtons = styled.div`
  visibility: hidden;
  font-size: 12px;
  margin-left: 4px;

  ${IconButton} {
    &:first-child {
      margin-bottom: 4px;
    }
  }
`;

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
    padding: 0;
  }

  .ant-list-item-content {
    padding: 0 4px;
    justify-content: space-between;
    align-items: center;

    &:hover {
      ${ItemButtons} {
        visibility: visible;
      }
    }
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
        pathname: `/${textUtils.slug(val.data)}`,
        search: 'expanded=true',
      });
    });
  };

  deleteLabel = (e, label) => {
    e.stopPropagation();
    const { actions } = this.props;
    if (confirm(`${label.title}\n이 라벨을 삭제하시겠습니까?`)) {
      actions.deleteLabel(label._id).then(val => {
        history.push({
          pathname: `/all`,
          search: 'expanded=true',
        });
      });
    }
  };

  renderHeader = () => {
    const { label, allMemosSize } = this.props;

    return (
      <Flex mb="0.5rem" justify="space-between">
        <HeaderTitle
          to="/all?expanded=true"
          active={label._id ? undefined : 'true'}
        >
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
                search: 'expanded=true',
              });
            }}
          >
            {`${item.title} (${item.memoIds.size})`}
            <ItemButtons>
              <IconButton>
                <i className="fa fa-pencil" />
              </IconButton>
              <IconButton onClick={e => this.deleteLabel(e, item)}>
                <i className="fa fa-trash-o" />
              </IconButton>
            </ItemButtons>
          </AntListItem>
        )}
      />
    );
  };

  render() {
    const { labels } = this.props;

    return (
      <Container>
        {this.renderHeader()}
        {this.renderList()}
        {labels.size === 0 && (
          <Flex justify="center">
            <Button type="primary" icon="plus" onClick={this.addLabel}>
              새 라벨 추가
            </Button>
          </Flex>
        )}
      </Container>
    );
  }
}
