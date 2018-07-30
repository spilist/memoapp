import React, { Component } from 'react';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Spinner } from '../common';
import { Input, Button, Tag, Menu, Dropdown } from 'antd';
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';
import history from '~/history';

const Container = styled.div`
  display: ${props => (props.hidden ? 'none' : 'flex')};
  flex-direction: column;
  width: 100%;
  padding: 0.5rem 1rem;
  overflow: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${oc.gray6};
  margin-bottom: 0.5rem;
  flex: 0 0 5rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;
  padding: 0.5rem 0;
  max-width: calc(100% - 4rem);
`;

const HeaderInput = styled(Input)`
  &.ant-input {
    border: 0;
    border-radius: 0;
    font-size: 24px;
    padding: 0;
    margin: 0;

    &:focus {
      box-shadow: none;
    }
  }
`;

const ItemLabels = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ItemLabelsIcon = styled.div`
  color: ${oc.indigo5};
  margin-right: 4px;
`;

const AntTag = styled(Tag)`
  &.ant-tag {
    font-size: 10px;
    margin-right: 4px;
  }
`;

const Textarea = styled(Input.TextArea)`
  &.ant-input {
    resize: none;
    border: 0;
    border-radius: 0;
    min-height: 100%;
    padding: 0;
    font-size: 14px;
    margin-bottom: 1rem;

    &:focus {
      box-shadow: none;
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  flex: 0 0 4rem;
  padding: 0.5rem 0;
`;

const Content = styled.div`
  flex: 1 1;
`;

export default class Memo extends Component {
  updateMemo = (name, e) => {
    const { MemoListActions, memo } = this.props;
    const value = e.target.value;
    if (value !== memo[name]) {
      MemoListActions.updateMemo({
        id: memo._id,
        [name]: e.target.value,
      });
    }
  };

  deleteMemo = () => {
    const {
      LabelListActions,
      MemoListActions,
      memo,
      label,
      search,
    } = this.props;
    if (confirm(`${memo.title}\n이 메모를 삭제하시겠습니까?`)) {
      if (label._id) {
        MemoListActions.deleteMemo(memo._id).then(val => {
          LabelListActions.deleteMemosFromLabel(label._id, [val.data._id]).then(
            () => {
              history.replace({
                pathname: `/${textUtils.slug(label)}`,
                search,
              });
            }
          );
        });
      } else {
        MemoListActions.deleteMemo(memo._id).then(val =>
          history.replace({
            pathname: `/${textUtils.slug(label)}`,
            search,
          })
        );
      }
    }
  };

  deleteMemoFromLabel = (labelId, e) => {
    e && e.stopPropagation();
    const { memo, LabelListActions } = this.props;
    LabelListActions.deleteMemosFromLabel(labelId, [memo._id]);
  };

  addMemoToLabel = labelId => {
    const { memo, LabelListActions } = this.props;
    LabelListActions.addMemosToLabel(labelId, [memo._id]);
  };

  renderHeader = () => {
    const { memo, labels } = this.props;
    const memoLabels = labels.filter(lab => lab.memoIds.includes(memo._id));
    const restLabels = labels.filter(lab => !lab.memoIds.includes(memo._id));

    const labelMenu = (
      <Menu onClick={({ item, key }) => this.addMemoToLabel(key)}>
        {restLabels.map(lab => (
          <Menu.Item key={lab._id}>{lab.title}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Header>
        <HeaderLeft>
          <HeaderInput
            defaultValue={memo.title}
            onBlur={e => this.updateMemo('title', e)}
            onPressEnter={e => {
              this.updateMemo('title', e);
              this.contentTextarea.focus();
            }}
          />
          <ItemLabels>
            <ItemLabelsIcon>
              <i className="fa fa-tags" />
            </ItemLabelsIcon>
            {memoLabels.map(lab => (
              <AntTag
                key={lab._id}
                color="geekblue"
                onClick={e => {
                  e.stopPropagation();
                  history.push({
                    pathname: `/${textUtils.slug(lab)}`,
                  });
                }}
                closable
                onClose={e => this.deleteMemoFromLabel(lab._id, e)}
              >
                {textUtils.truncate(lab.title, 25)}
              </AntTag>
            ))}
            {restLabels.size > 0 && (
              <Dropdown overlay={labelMenu} trigger={['click']}>
                <AntTag style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <i className="fa fa-plus" /> 추가
                </AntTag>
              </Dropdown>
            )}
          </ItemLabels>
        </HeaderLeft>
        <HeaderRight>
          <Button
            type="danger"
            size="small"
            onClick={this.deleteMemo}
            tabIndex="-1"
          >
            삭제
          </Button>
          {timeUtils.format(memo.updatedAt)}
        </HeaderRight>
      </Header>
    );
  };

  renderContent = () => {
    const { memo } = this.props;

    return (
      <Content>
        <Textarea
          innerRef={ref => (this.contentTextarea = ref)}
          autosize
          defaultValue={memo.content}
          onBlur={e => this.updateMemo('content', e)}
        />
      </Content>
    );
  };

  render() {
    const { loading, hidden } = this.props;
    return loading ? (
      <Spinner />
    ) : (
      <Container hidden={hidden}>
        {this.renderHeader()}
        {this.renderContent()}
      </Container>
    );
  }
}
