import React, { Component, Fragment } from 'react';
import { List } from 'immutable';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Checkbox, List as AntList } from 'antd';
import { Spinner } from '../common';
import timeUtils from '~/utils/TimeUtils';

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const MemoListWrapper = styled.div`
  padding: 0.5rem 1rem;
  flex: 0 0 14rem;
  border-right: 2px solid ${oc.gray6};
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

const MemoListHeaderTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-left: 4px;
`;

const AntListItem = styled(AntList.Item)`
  flex-direction: row-reverse;
  padding-left: 0.5rem;
  background-color: ${props => props.checked && oc.indigo1};
  cursor: pointer;

  &:hover {
    background-color: ${props => !props.checked && oc.teal1};
  }

  .ant-list-item-content {
    justify-content: flex-start;
    flex: 0 0 2rem;
  }
`;

const initialState = props => ({
  expanded: false,
  checkedMemos: List(),
});

export default class MemoList extends Component {
  state = initialState(this.props);

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
      this.setState({ checkedMemos: initialState(this.props).checkedMemos });
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
    const { labelName, memos, loading } = this.props;
    const { expanded } = this.state;
    const size = loading ? '...' : memos.size;
    return (
      <Box>
        <Flex justify="space-between" mb="1rem" align="center">
          <Flex>
            <IconButton onClick={this.toggleExpansion} active={expanded}>
              <i className="fa fa-list" />
            </IconButton>
            <MemoListHeaderTitle>
              {`${labelName} (${size})`}
            </MemoListHeaderTitle>
          </Flex>
          <IconButton>
            <i className="fa fa-plus" />
          </IconButton>
        </Flex>
        <Box pl="0.5rem">
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
    const { memos, loading } = this.props;
    const { checkedMemos } = this.state;
    return loading ? (
      <Spinner />
    ) : (
      <AntList
        itemLayout="horizontal"
        dataSource={memos}
        renderItem={item => (
          <AntListItem checked={checkedMemos.includes(item)}>
            <Checkbox
              checked={checkedMemos.includes(item)}
              onChange={() => this.toggleCheckMemo(item)}
            />
            <AntList.Item.Meta
              title={item.title}
              description={
                <span>
                  {timeUtils.format(item.updatedAt)} {item.content}
                </span>
              }
            />
          </AntListItem>
        )}
      />
    );
  };

  render() {
    return (
      <Container>
        <MemoListWrapper>
          {this.renderHeader()}
          {this.renderList()}
        </MemoListWrapper>
      </Container>
    );
  }
}
