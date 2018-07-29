import React, { Component } from 'react';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Button, List as AntList } from 'antd';
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.5rem 1rem;
  overflow: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  flex: 0 0 3rem;
`;

const HeaderTitle = styled.div`
  font-size: 20px;
`;

const MemoList = styled.div`
  padding: 0 0.5rem 0.5rem;
  border-bottom: 1px solid ${oc.gray6};

  .ant-spin-container {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .ant-list-split .ant-list-item {
    padding: 0;
    border: 0;
  }

  .ant-list-item-content {
    padding: 0.5rem;
  }
`;

const Card = styled.div`
  border: 2px solid ${oc.indigo1};
  box-shadow: -2px 2px 8px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  padding: 0.5rem;
  width: 6.5rem;
  height: 8rem;
`;

const CardTitle = styled.div`
  font-weight: bold;
  font-size: 16px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardContent = styled.div`
  margin-top: 0.5rem;
  color: ${oc.gray6};
  word-break: break-all;
`;

const Content = styled.div`
  flex: 1 1;
`;

export default class CheckedMemos extends Component {
  deleteAllMemos = () => {
    const { actions, memos, deleteAllCallback } = this.props;
    if (confirm('선택한 메모를 모두 삭제하시겠습니까?')) {
      actions
        .deleteMemos(memos.map(memo => ({ id: memo._id })))
        .then(deleteAllCallback);
    }
  };

  renderHeader = () => {
    const { memos } = this.props;
    return (
      <Header>
        <HeaderTitle>메모 ({memos.size})개를 선택함</HeaderTitle>
        <Button
          type="danger"
          size="small"
          onClick={this.deleteAllMemos}
          tabIndex="-1"
        >
          전체 삭제
        </Button>
      </Header>
    );
  };

  renderMemosList = () => {
    const { memos } = this.props;
    return (
      <MemoList>
        <AntList
          dataSource={memos}
          renderItem={item => (
            <AntList.Item>
              <Card>
                <CardTitle>{item.title}</CardTitle>
                <CardContent>
                  {timeUtils.format(item.updatedAt)} |{' '}
                  {textUtils.truncate(item.content)}
                </CardContent>
              </Card>
            </AntList.Item>
          )}
        />
      </MemoList>
    );
  };

  renderContent = () => {
    return <Content>content</Content>;
  };

  render() {
    return (
      <Container>
        {this.renderHeader()}
        {this.renderMemosList()}
        {this.renderContent()}
      </Container>
    );
  }
}