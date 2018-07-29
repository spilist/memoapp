import React, { Component } from 'react';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Spinner } from '../common';
import { Input, Button, Tag } from 'antd';
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

const getState = props => ({
  title: props.memo.title,
  content: props.memo.content,
});

export default class Memo extends Component {
  state = getState(this.props);

  componentDidUpdate(prevProps) {
    if (this.props.memo.updatedAt !== prevProps.memo.updatedAt) {
      this.setState(getState(this.props));
    }
  }

  handleChange = (name, e) => {
    this.setState({ [name]: e.target.value });
  };

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
    const { LabelListActions, MemoListActions, memo, label } = this.props;
    if (confirm(`${memo.title}\n이 메모를 삭제하시겠습니까?`)) {
      if (label._id) {
        MemoListActions.deleteMemo(memo._id).then(val => {
          LabelListActions.deleteMemosFromLabel(label._id, [val.data._id]).then(
            () => {
              history.replace(`/${textUtils.slug(label)}`);
            }
          );
        });
      } else {
        MemoListActions.deleteMemo(memo._id).then(val =>
          history.replace(`/${textUtils.slug(label)}`)
        );
      }
    }
  };

  renderHeader = () => {
    const { memo, labels } = this.props;
    const { title } = this.state;
    const memoLabels = labels.filter(lab => lab.memoIds.includes(memo._id));

    return (
      <Header>
        <HeaderLeft>
          <HeaderInput
            value={title}
            onChange={e => this.handleChange('title', e)}
            onBlur={e => this.updateMemo('title', e)}
            onPressEnter={e => {
              this.updateMemo('title', e);
              this.contentTextarea.focus();
            }}
          />
          {memoLabels.size > 0 && (
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
                >
                  {textUtils.truncate(lab.title, 25)}
                </AntTag>
              ))}
            </ItemLabels>
          )}
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
    const { content } = this.state;

    return (
      <Content>
        <Textarea
          innerRef={ref => (this.contentTextarea = ref)}
          autosize
          value={content}
          onChange={v => this.handleChange('content', v)}
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
