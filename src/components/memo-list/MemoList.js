import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import QueryString from 'query-string';
import { List } from 'immutable';
import styled from 'styled-components';
import oc from 'open-color-js';
import { Flex, Box } from 'reflexbox';
import { Checkbox, List as AntList, Button, Tag } from 'antd';
import timeUtils from '~/utils/TimeUtils';
import textUtils from '~/utils/TextUtils';
import history from '~/history';
import Memo from '../memo/Memo';
import CheckedMemos from '../checked-memos/CheckedMemos';
import LabelList from '../label-list/LabelList';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;

  .ant-list-empty-text {
    padding: 1rem 0.5rem;
  }
`;

const MemoListWrapper = styled.div`
  padding: 0.5rem;
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

const MemoListHeaderTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-left: 4px;
  cursor: pointer;
`;

const AntListItem = styled(AntList.Item)`
  flex-direction: row-reverse;
  padding: 0 0.5rem 0 1rem;
  margin: 0 -0.5rem;
  cursor: ${props => props.clickable && 'pointer'};
  transition: background-color 0.3s ease;
  background-color: ${props => {
    if (props.checked) {
      return oc.indigo1;
    } else if (props.opened) {
      return oc.orange3;
    }
  }};

  &:hover {
    background-color: ${props =>
      props.clickable && !props.checked && !props.opened && oc.orange1};
  }

  .ant-list-item-content {
    justify-content: flex-start;
    flex: 0 0 2rem;
  }

  .ant-list-item-meta {
    max-width: calc(100% - 2rem);
  }

  .ant-list-item-meta-content {
    max-width: 100%;
  }

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

const ItemContent = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemLabels = styled.div`
  padding-top: 4px;
`;

const AntTag = styled(Tag)`
  &.ant-tag {
    font-size: 10px;
    margin-right: 4px;
    background-color: ${props => props.active && oc.cyan2};

    &:hover {
      background-color: ${props => !props.active && oc.blue2};
    }
  }
`;

const getState = props => {
  const { location } = props;
  const query = QueryString.parse(location.search);

  return {
    expanded: Boolean(query && query.expanded === 'true'),
    checkedMemos: List(),
  };
};

export default class MemoList extends Component {
  state = getState(this.props);

  toggleExpansion = () => {
    this.setState({ expanded: !this.state.expanded }, () => {
      history.replace({
        search: this.state.expanded ? 'expanded=true' : '',
      });
    });
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
      this.setState({
        checkedMemos: checkedMemos.push(memo),
      });
    } else {
      this.setState({
        checkedMemos: checkedMemos.delete(index),
      });
    }
  };

  addMemo = () => {
    const { label, LabelListActions, MemoListActions, location } = this.props;
    if (label._id) {
      MemoListActions.createNewMemo().then(val => {
        LabelListActions.addMemosToLabel(label._id, [val.data._id]).then(() => {
          history.push({
            pathname: `/${textUtils.slug(label)}/${textUtils.slug(val.data)}`,
            search: location.search,
          });
        });
      });
    } else {
      MemoListActions.createNewMemo().then(val => {
        history.push({
          pathname: `/${textUtils.slug(label)}/${textUtils.slug(val.data)}`,
          search: location.search,
        });
      });
    }
  };

  deleteAllCallback = () => {
    const { label, location } = this.props;
    this.setState({ checkedMemos: getState(this.props).checkedMemos }, () =>
      history.replace({
        pathname: `/${textUtils.slug(label)}`,
        search: location.search,
      })
    );
  };

  renderHeader = () => {
    const { label, memos } = this.props;
    const { expanded } = this.state;
    return (
      <Box>
        <Flex justify="space-between" mb="1rem" align="center">
          <Flex align="flex-start">
            <IconButton onClick={this.toggleExpansion} active={expanded}>
              <i className="fa fa-list" />
            </IconButton>
            <MemoListHeaderTitle onClick={this.toggleExpansion}>
              {`${label.title} (${memos.size})`}
            </MemoListHeaderTitle>
          </Flex>
          <IconButton onClick={this.addMemo}>
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

  renderListItem = item => {
    const { label, labels, openedMemo, location } = this.props;
    const { checkedMemos } = this.state;
    const itemLabels = labels.filter(lab => lab.memoIds.includes(item._id));

    return (
      <AntListItem
        checked={checkedMemos.includes(item)}
        clickable={checkedMemos.size === 0 ? 'true' : undefined}
        opened={
          checkedMemos.size === 0 && openedMemo && openedMemo._id === item._id
            ? 'true'
            : undefined
        }
        onClick={() => {
          if (checkedMemos.size > 0) {
            return;
          }
          history.push({
            pathname: `/${textUtils.slug(label)}/${textUtils.slug(item)}`,
            search: location.search,
          });
        }}
      >
        <Checkbox
          checked={checkedMemos.includes(item)}
          onChange={() => this.toggleCheckMemo(item)}
          onClick={e => e.stopPropagation()}
        />
        <AntList.Item.Meta
          title={item.title}
          description={
            <Fragment>
              <ItemContent>
                {timeUtils.format(item.updatedAt)} | {item.content}
              </ItemContent>
              {itemLabels.size > 0 && (
                <ItemLabels>
                  {itemLabels.map(lab => (
                    <AntTag
                      key={lab._id}
                      color="geekblue"
                      active={label._id === lab._id ? 'true' : undefined}
                      onClick={e => {
                        e.stopPropagation();
                        history.push({
                          pathname: `/${textUtils.slug(lab)}`,
                          search: location.search,
                        });
                      }}
                    >
                      {textUtils.truncate(lab.title, 17)}
                    </AntTag>
                  ))}
                </ItemLabels>
              )}
            </Fragment>
          }
        />
      </AntListItem>
    );
  };

  renderList = () => {
    const { memos, label } = this.props;
    let labelPrefix;
    if (!label._id) {
      labelPrefix = '';
    } else {
      labelPrefix = `라벨 [${label.title}]에 `;
    }

    return (
      <Fragment>
        <AntList
          itemLayout="horizontal"
          locale={{ emptyText: `${labelPrefix}메모가 없습니다.` }}
          dataSource={memos}
          renderItem={item => this.renderListItem(item)}
        />
        {memos.size === 0 && (
          <Flex justify="center">
            <Button type="primary" icon="plus" onClick={this.addMemo}>
              새 메모 추가하기
            </Button>
          </Flex>
        )}
      </Fragment>
    );
  };

  render() {
    const {
      label,
      labels,
      allMemosSize,
      openedMemo,
      openingMemo,
      MemoListActions,
      LabelListActions,
      location,
    } = this.props;
    const { expanded, checkedMemos } = this.state;

    if (!label) {
      return null;
    }

    return (
      <Container>
        {expanded && (
          <LabelList
            label={label}
            labels={labels}
            allMemosSize={allMemosSize}
            actions={LabelListActions}
          />
        )}
        <MemoListWrapper>
          {this.renderHeader()}
          {this.renderList()}
        </MemoListWrapper>
        {checkedMemos.size > 0 && (
          <CheckedMemos
            memos={checkedMemos}
            label={label}
            labels={labels}
            MemoListActions={MemoListActions}
            LabelListActions={LabelListActions}
            deleteAllCallback={this.deleteAllCallback}
            search={location.search}
          />
        )}
        {openedMemo && (
          <Memo
            hidden={checkedMemos.size > 0}
            label={label}
            labels={labels}
            memo={openedMemo}
            loading={openingMemo}
            MemoListActions={MemoListActions}
            LabelListActions={LabelListActions}
            search={location.search}
          />
        )}
      </Container>
    );
  }
}
