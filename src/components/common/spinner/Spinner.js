import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'reflexbox';
import { FadingCircle } from 'better-react-spinkit';

class Spinner extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    size: 50,
  };

  render() {
    return (
      <Flex justify="center" align="center" auto style={{ height: '100%' }}>
        <FadingCircle size={this.props.size} color={this.props.color} />
      </Flex>
    );
  }
}

export default Spinner;
