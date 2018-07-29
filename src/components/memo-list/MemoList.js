import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import QueryString from 'query-string';
import { List } from 'immutable';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Checkbox, List as AntList, Button } from 'antd';
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';
import history from '~/history';
import Memo from '../memo/Memo';
import CheckedMemos from '../checked-memos/CheckedMemos';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const MemoListWrapper = styled.div`
  padding: 0.5rem 1rem;
  flex: 0 0 14rem;
  border-right: 2px solid ${oc.gray6};
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

const MemoListHeaderTitle = styled(Link)`
  font-size: 16px;
  font-weight: bold;
  margin-left: 4px;
`;

const AntListItem = styled(AntList.Item)`
  flex-direction: row-reverse;
  padding-left: 0.5rem;
  cursor: ${props => props.clickable && 'pointer'};
  transition: background-color 0.3s ease;
  background-color: ${props => {
    if (props.checked) {
      return oc.indigo1;
    } else if (props.opened) {
      return oc.orange3;
    }
  }};

  &:hover {
    background-color: ${props =>
      props.clickable && !props.checked && !props.opened && oc.orange1};
  }

  .ant-list-item-content {
    justify-content: flex-start;
    flex: 0 0 2rem;
  }

  .ant-list-item-meta {
    max-width: 150px;
  }

  .ant-list-item-meta-content {
    max-width: 100%;
  }

  .ant-list-item-meta-description,
  .ant-list-item-meta-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-list-item-meta-title {
    font-weight: bold;
    font-size: 16px;
  }
`;

const getState = props => {
  const { location } = props;
  const query = QueryString.parse(location.search);

  return {
    expanded: Boolean(query && query.expanded === 'true'),
    checkedMemos: List(),
  };
};

export default class MemoList extends Component {
  state = getState(this.props);

  toggleExpansion = () => {
    this.setState({ expanded: !this.state.expanded }, () => {
      history.replace({
        search: this.state.expanded ? 'expanded=true' : '',
      });
    });
  };

  isCheckedAll = () => {
    const { memos } = this.props;
    const { checkedMemos } = this.state;
    if (memos.size === 0) {
      return false;
    }

    return checkedMemos.size === memos.size;
  };

  toggleCheckAll = () => {
    if (this.isCheckedAll()) {
      this.setState({ checkedMemos: getState(this.props).checkedMemos });
    } else {
      this.setState({
        checkedMemos: this.props.memos,
      });
    }
  };

  toggleCheckMemo = memo => {
    const { checkedMemos } = this.state;
    const index = checkedMemos.findIndex(checked => checked._id === memo._id);

    if (index === -1) {
      // not checked
      this.setState({
        checkedMemos: checkedMemos.push(memo),
      });
    } else {
      this.setState({
        checkedMemos: checkedMemos.delete(index),
      });
    }
  };

  addMemo = () => {
    const { label, MemoListActions } = this.props;
    MemoListActions.createNewMemo().then(val => {
      history.push({
        pathname: `/${label}/${textUtils.slug(val.data)}`,
      });
    });
  };

  deleteAllCallback = () => {
    const { label } = this.props;
    this.setState({ checkedMemos: getState(this.props).checkedMemos }, () =>
      history.replace({
        pathname: `/${label}`,
      })
    );
  };

  renderHeader = () => {
    const { label, labelName, memos } = this.props;
    const { expanded } = this.state;
    return (
      <Box>
        <Flex justify="space-between" mb="1rem" align="center">
          <Flex>
            <IconButton onClick={this.toggleExpansion} active={expanded}>
              <i className="fa fa-list" />
            </IconButton>
            <MemoListHeaderTitle to={`/${label}`}>
              {`${labelName} (${memos.size})`}
            </MemoListHeaderTitle>
          </Flex>
          <IconButton onClick={this.addMemo}>
            <i className="fa fa-plus" />
          </IconButton>
        </Flex>
        <Box pl="0.5rem" mb="0.5rem">
          <Checkbox
            checked={this.isCheckedAll()}
            onChange={this.toggleCheckAll}
          >
            {this.isCheckedAll() ? '모두 선택 해제' : '모두 선택'}
          </Checkbox>
        </Box>
      </Box>
    );
  };

  renderList = () => {
    const { memos, label, openedMemo } = this.props;
    const { checkedMemos } = this.state;
    let labelPrefix;
    if (label === 'all') {
      labelPrefix = '';
    } else if (label === 'untagged') {
      labelPrefix = '미분류된 ';
    } else {
      labelPrefix = `${label} 라벨에 `;
    }

    return (
      <Fragment>
        <AntList
          itemLayout="horizontal"
          locale={{ emptyText: `${labelPrefix}메모가 없습니다.` }}
          dataSource={memos}
          renderItem={item => (
            <AntListItem
              checked={checkedMemos.includes(item)}
              clickable={checkedMemos.size === 0 ? 'true' : undefined}
              opened={
                checkedMemos.size === 0 &&
                openedMemo &&
                openedMemo._id === item._id
                  ? 'true'
                  : undefined
              }
              onClick={() => {
                if (checkedMemos.size > 0) {
                  return;
                }
                history.push({
                  pathname: `/${label}/${textUtils.slug(item)}`,
                });
              }}
            >
              <Checkbox
                checked={checkedMemos.includes(item)}
                onChange={() => this.toggleCheckMemo(item)}
                onClick={e => e.stopPropagation()}
              />
              <AntList.Item.Meta
                title={item.title}
                description={
                  <span>
                    {timeUtils.format(item.updatedAt)} | {item.content}
                  </span>
                }
              />
            </AntListItem>
          )}
        />
        {memos.size === 0 && (
          <Flex justify="center">
            <Button type="primary" icon="plus" onClick={this.addMemo}>
              새 메모 추가하기
            </Button>
          </Flex>
        )}
      </Fragment>
    );
  };

  render() {
    const { label, openedMemo, openingMemo, MemoListActions } = this.props;
    const { checkedMemos } = this.state;

    return (
      <Container>
        <MemoListWrapper>
          {this.renderHeader()}
          {this.renderList()}
        </MemoListWrapper>
        {checkedMemos.size > 0 && (
          <CheckedMemos
            memos={checkedMemos}
            actions={MemoListActions}
            deleteAllCallback={this.deleteAllCallback}
          />
        )}
        {openedMemo && (
          <Memo
            hidden={checkedMemos.size > 0}
            label={label}
            memo={openedMemo}
            loading={openingMemo}
            actions={MemoListActions}
          />
        )}
      </Container>
    );
  }
}
