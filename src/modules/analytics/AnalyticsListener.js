// @flow

import { Component, type Node } from 'react';
import PropTypes from 'prop-types';
import AnalyticsEvent, { type FireAnalyticsEvent } from './AnalyticsEvent';

type Props = {
  children?: Node,
  channel: string,
  onEvent: (event: AnalyticsEvent) => void,
}

const ContextTypes = {
  fireAnalyticsEvent: PropTypes.func,
};

export default class AnalyticsListener extends Component<Props> {
  static contextTypes = ContextTypes
  static childContextTypes = ContextTypes

  getChildContext = () => ({
    fireAnalyticsEvent: this.fireAnalyticsEvent,
  })

  fireAnalyticsEvent: FireAnalyticsEvent = (event, channel) => {
    if (channel === this.props.channel) {
      this.props.onEvent(event);
    } else if (this.context.fireAnalyticsEvent) {
      this.context.fireAnalyticsEvent(event, channel);
    }
  }

  render() {
    return this.props.children;
  }
}
