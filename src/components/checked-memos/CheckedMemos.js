import React, { Component } from 'react';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Button, List as AntList, Menu, Dropdown } from 'antd';
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';
import arrayUtils from '~/utils/ArrayUtils';

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
  display: flex;
  justify-content: space-around;
  flex: 1 1;
`;

const ContentGroup = styled.div`
  padding: 0.5rem;
`;

const ContentGroupTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ContentGroupDescription = styled.div`
  padding-left: 0.5rem;
  font-size: 14px;
  margin-bottom: 1rem;
`;

const ContentGroupActions = styled.div`
  padding-left: 0.5rem;
`;

export default class CheckedMemos extends Component {
  deleteAllMemos = () => {
    const {
      LabelListActions,
      MemoListActions,
      memos,
      label,
      deleteAllCallback,
    } = this.props;
    if (confirm('선택한 메모를 모두 삭제하시겠습니까?')) {
      if (label._id) {
        MemoListActions.deleteMemos(memos.map(memo => ({ id: memo._id }))).then(
          val => {
            LabelListActions.deleteMemosFromLabel(
              label._id,
              memos.map(memo => memo._id)
            ).then(deleteAllCallback);
          }
        );
      } else {
        MemoListActions.deleteMemos(memos.map(memo => ({ id: memo._id }))).then(
          deleteAllCallback
        );
      }
    }
  };

  addMemosToLabel = labelId => {
    const { memos, LabelListActions } = this.props;
    LabelListActions.addMemosToLabel(labelId, memos.map(memo => memo._id));
  };

  deleteMemosFromLabel = labelId => {
    const { memos, LabelListActions } = this.props;
    LabelListActions.deleteMemosFromLabel(labelId, memos.map(memo => memo._id));
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
    const { memos, labels } = this.props;
    const memoLabelIds = {};
    memos.forEach(memo => {
      memoLabelIds[memo._id] = labels
        .filter(lab => lab.memoIds.includes(memo._id))
        .map(label => label._id);
    });
    const commonLabelIds = arrayUtils.intersect(...Object.values(memoLabelIds));
    const restLabels = labels.filter(lab => !commonLabelIds.includes(lab._id));

    const labelMenu = (
      <Menu onClick={({ item, key }) => this.addMemosToLabel(key)}>
        {restLabels.map(lab => (
          <Menu.Item key={lab._id}>{lab.title}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Content>
        <ContentGroup>
          <ContentGroupTitle>라벨 추가</ContentGroupTitle>
          <ContentGroupDescription>
            선택한 메모 전체에 라벨을 추가합니다.
          </ContentGroupDescription>
          <ContentGroupActions>
            <Dropdown overlay={labelMenu} trigger={['click']}>
              <Button type="primary" icon="plus">
                추가하기
              </Button>
            </Dropdown>
          </ContentGroupActions>
        </ContentGroup>
        <ContentGroup>
          <ContentGroupTitle>라벨 삭제</ContentGroupTitle>
          <ContentGroupDescription>
            선택한 메모에서 해당 라벨을 삭제합니다.
          </ContentGroupDescription>
        </ContentGroup>
      </Content>
    );
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
