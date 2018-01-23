// @flow

import { Component } from 'react';
import PropTypes from 'prop-types';
import withAnalytics from './withAnalytics';

class AnalyticsBoundary extends Component {
  static childContextTypes = {
    raiseAnalyticsEvent: PropTypes.func,
  }

  getChildContext = () => ({
    raiseAnalyticsEvent: this.onEvent,
  })

  onEvent = event => this.props.onEvent(event, this.props.raiseAnalyticsEvent)

  render() {
    return this.props.children;
  }
}

export default withAnalytics(AnalyticsBoundary);
