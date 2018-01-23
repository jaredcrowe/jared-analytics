// @flow

import { Component } from 'react';
import PropTypes from 'prop-types';

type AnalyticsListenerProps = {
  channel: string,
  onEvent: (event: AnalyticsEventType) => void,
}

const ContextTypes = {
  fireAnalyticsEvent: PropTypes.func,
};

export default class AnalyticsListener extends Component<AnalyticsListenerProps> {
  static contextTypes = ContextTypes
  static childContextTypes = ContextTypes

  getChildContext = () => ({
    fireAnalyticsEvent: this.fireAnalyticsEvent,
  })

  fireAnalyticsEvent = (event, channel) => {
    if (channel === this.props.channel) {
      this.props.onEvent(event);
    }

    if (this.context.fireAnalyticsEvent) {
      this.context.fireAnalyticsEvent(event, channel);
    }
  }

  render() {
    return this.props.children;
  }
}
