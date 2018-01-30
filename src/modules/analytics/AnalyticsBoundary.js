// @flow

import { Component } from 'react';
import PropTypes from 'prop-types';

export default class AnalyticsBoundary extends Component<*> {
  static childContextTypes = {
    raiseAnalyticsEvent: PropTypes.func,
  }

  getChildContext = () => ({
    raiseAnalyticsEvent: this.props.onEvent,
  })

  render() {
    return this.props.children;
  }
}
