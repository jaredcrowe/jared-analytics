// @flow

import React, { Component, type Node } from 'react';
import PropTypes from 'prop-types';
import { UIAnalyticsEvent } from './';
import type { FireUIAnalyticsEventSignature } from './types';

type Props = {
  children?: Node,
  channel?: string,
  onEvent: (event: UIAnalyticsEvent) => void,
};

const ContextTypes = {
  fireAnalyticsEvent: PropTypes.func,
};

export default class AnalyticsListener extends Component<Props, void> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  getChildContext = () => ({
    fireAnalyticsEvent: this.fireAnalyticsEvent,
  });

  fireAnalyticsEvent: FireUIAnalyticsEventSignature = (event, channel) => {
    if (channel === this.props.channel) {
      this.props.onEvent(event);
    } else if (this.context.fireAnalyticsEvent) {
      this.context.fireAnalyticsEvent(event, channel);
    }
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}
