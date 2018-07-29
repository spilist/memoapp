import React, { Component } from 'react';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Spinner } from '../common';
import { Input, Button } from 'antd';
import timeUtils from '~/utils/TimeUtils';
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
  flex: 0 0 4.5rem;
`;

const HeaderInput = styled(Input)`
  &.ant-input {
    border: 0;
    border-radius: 0;
    flex: 1 1 auto;
    font-size: 24px;
    padding: 0;
    margin: 0.5rem 0;

    &:focus {
      box-shadow: none;
    }
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
    const { actions, memo } = this.props;
    const value = e.target.value;
    if (value !== memo[name]) {
      actions.updateMemo({
        id: memo._id,
        [name]: e.target.value,
      });
    }
  };

  deleteMemo = () => {
    const { actions, memo, label } = this.props;
    if (confirm(`${memo.title}\n이 메모를 삭제하시겠습니까?`)) {
      actions.deleteMemo(memo._id).then(val => history.replace(`/${label}`));
    }
  };

  renderHeader = () => {
    const { memo } = this.props;
    const { title } = this.state;

    return (
      <Header>
        <HeaderInput
          value={title}
          onChange={e => this.handleChange('title', e)}
          onBlur={e => this.updateMemo('title', e)}
          onPressEnter={e => {
            this.updateMemo('title', e);
            this.contentTextarea.focus();
          }}
        />
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
