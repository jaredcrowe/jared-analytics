// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../analytics';

class Button extends Component<*> {
  handleClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    const {
      createAnalyticsEvent,
      fireAnalyticsEvent,
      raiseAnalyticsEvent,
    } = this.props;

    createAnalyticsEvent('atlaskit-button-click', { version: '1.0.0' })
      .fire('atlaskit');

    raiseAnalyticsEvent(
      createAnalyticsEvent('click')
    );
  };

  render() {
    const {
      onClick,
      createAnalyticsEvent,
      fireAnalyticsEvent,
      raiseAnalyticsEvent,
      analyticsNamespace,
      ...rest
    } = this.props;
    return <button {...rest} onClick={this.handleClick} />;
  }
}

export default withAnalytics(Button);
