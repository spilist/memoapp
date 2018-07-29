import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Checkbox, List as AntList } from 'antd';
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';
import history from '~/history';
import Memo from '../memo/Memo';

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
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: ${props => {
    if (props.checked) {
      return oc.indigo1;
    } else if (props.opened) {
      return oc.orange3;
    }
  }};

  &:hover {
    background-color: ${props => !props.checked && !props.opened && oc.orange1};
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

const getState = props => ({
  expanded: false,
  checkedMemos: List(),
});

export default class MemoList extends Component {
  state = getState(this.props);

  toggleExpansion = () => {
    this.setState({ expanded: !this.state.expanded });
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
          <IconButton>
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
    return (
      <AntList
        itemLayout="horizontal"
        dataSource={memos}
        renderItem={item => (
          <AntListItem
            checked={checkedMemos.includes(item)}
            opened={
              openedMemo && openedMemo._id === item._id ? 'true' : undefined
            }
            onClick={() =>
              history.push({
                pathname: `/${label}/${textUtils.slug(item)}`,
              })
            }
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
    );
  };

  render() {
    const { label, openedMemo, openingMemo, MemoListActions } = this.props;
    return (
      <Container>
        <MemoListWrapper>
          {this.renderHeader()}
          {this.renderList()}
        </MemoListWrapper>
        {openedMemo && (
          <Memo
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
