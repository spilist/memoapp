import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Spinner } from '../common';
import { Input, Button } from 'antd';
const { TextArea } = Input;
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';
import history from '~/history';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.5rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${oc.gray6};
  margin-bottom: 0.5rem;
`;

const HeaderRight = styled.div`
  flex: 0 0 2rem;
`;

const Content = styled.div``;

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
    actions.updateMemo({
      id: memo._id,
      [name]: e.target.value,
    });
  };

  deleteMemo = () => {
    const { actions, memo, label } = this.props;
    actions.deleteMemo(memo._id).then(val => history.replace(`/${label}`));
  };

  renderHeader = () => {
    const { memo } = this.props;
    const { title } = this.state;

    return (
      <Header>
        <TextArea
          autosize
          value={title}
          onChange={e => this.handleChange('title', e)}
          onBlur={e => this.updateMemo('title', e)}
        />
        <HeaderRight>
          <Button type="danger" size="small" onClick={this.deleteMemo}>
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
        <TextArea
          autosize
          value={content}
          onChange={v => this.handleChange('content', v)}
          onBlur={e => this.updateMemo('content', e)}
        />
      </Content>
    );
  };

  render() {
    const { loading } = this.props;
    return loading ? (
      <Spinner />
    ) : (
      <Container>
        {this.renderHeader()}
        {this.renderContent()}
      </Container>
    );
  }
}
