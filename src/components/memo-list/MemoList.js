import React, { Component } from 'react';
import { List } from 'immutable';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Checkbox } from 'antd';
import { Spinner } from '../common';
import timeUtils from '~/utils/TimeUtils';

const MemoHeaderListIcon = styled.div`
  color: ${oc.gray6};
`;

const MemoHeaderTitle = styled.div`
  font-weight: bold;
`;

const MemoHeaderPlusIcon = styled.div`
  display: flex;
`;

const MemoCard = styled.div`
  padding: 8px;
`;

const MemoCardTitle = styled.div`
  font-size: 1rem;
`;

const MemoCardContent = styled.div`
  font-size: 12px;
`;

const CheckboxWrapper = styled.div`
  font-size: 12px;
`;

const initialState = {
  expanded: false,
  checkedMemos: List(),
};

export default class MemoList extends Component {
  state = initialState;

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
      this.setState({ checkedMemos: initialState.checkedMemos });
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
    const size = loading ? '...' : memos.size;
    return (
      <Box>
        <Flex justify="space-between">
          <Flex>
            <MemoHeaderListIcon onClick={this.toggleExpansion}>
              <i className="fa fa-list" />
            </MemoHeaderListIcon>
            <MemoHeaderTitle>{`${labelName} (${size})`}</MemoHeaderTitle>
          </Flex>
          <MemoHeaderPlusIcon>
            <i className="fa fa-plus" />
          </MemoHeaderPlusIcon>
        </Flex>
        <CheckboxWrapper>
          <Checkbox
            checked={this.isCheckedAll()}
            onChange={this.toggleCheckAll}
          >
            {this.isCheckedAll() ? '모두 선택 해제' : '모두 선택'}
          </Checkbox>
        </CheckboxWrapper>
      </Box>
    );
  };

  renderList = () => {
    const { memos, loading } = this.props;
    const { checkedMemos } = this.state;
    return loading ? (
      <Spinner />
    ) : (
      memos.map(memo => (
        <Flex key={memo._id}>
          <CheckboxWrapper>
            <Checkbox
              checked={checkedMemos.includes(memo)}
              onChange={() => this.toggleCheckMemo(memo)}
            />
          </CheckboxWrapper>
          <MemoCard>
            <MemoCardTitle>{memo.title}</MemoCardTitle>
            <MemoCardContent>
              {timeUtils.format(memo.updatedAt)}
              {memo.content}
            </MemoCardContent>
          </MemoCard>
        </Flex>
      ))
    );
  };

  render() {
    return (
      <Box p="1rem">
        {this.renderHeader()}
        {this.renderList()}
      </Box>
    );
  }
}
