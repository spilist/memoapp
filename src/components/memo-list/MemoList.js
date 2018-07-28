import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'reflexbox';
import timeUtils from '~/utils/TimeUtils';
import oc from 'open-color-js';
import { Spinner } from '../common';

const MemoHeaderListIcon = styled.div`
  color: ${oc.gray6};
`;

const MemoCardTitle = styled.div`
  font-size: 1rem;
`;

const MemoCardContent = styled.div`
  font-size: 12px;
`;

const initialState = {
  expanded: false,
};

export default class MemoList extends Component {
  state = initialState;

  toggleExpansion = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  renderHeader = () => {
    const { memoList } = this.props;
    return (
      <Box>
        <Flex>
          <MemoHeaderListIcon onClick={this.toggleExpansion}>
            <i className="fa fa-list" />
          </MemoHeaderListIcon>
        </Flex>
      </Box>
    );
  };

  renderList = () => {
    const { memoList, loading } = this.props;
    return loading ? (
      <Spinner />
    ) : (
      memoList.memos.map(memo => (
        <Flex key={memo._id}>
          <Box>
            <MemoCardTitle>{memo.title}</MemoCardTitle>
            <MemoCardContent>
              {timeUtils.format(memo.updatedAt)}
              {memo.content}
            </MemoCardContent>
          </Box>
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
