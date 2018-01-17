// @flow

import { Component } from 'react';
import PropTypes from 'prop-types';

export default class AnalyticsProvider extends Component {
  static childContextTypes = {
    fireAnalyticsEvent: PropTypes.func,
  };

  getChildContext = () => ({
    fireAnalyticsEvent: this.fireAnalyticsEvent,
  });

  fireAnalyticsEvent = (eventName, eventPayload) => {
    console.log('FIRING:', eventName, eventPayload);
  };

  render() {
    return this.props.children;
  }
}
