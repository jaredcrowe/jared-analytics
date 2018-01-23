// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../analytics';

class Button extends Component<*> {
  handleClick = e => {
    const { createAnalyticsEvent } = this.props;
    createAnalyticsEvent('click').raise();
    createAnalyticsEvent(
      'atlaskit-button-click',
      { version: '1.0.0' }
    ).fire('atlaskit');

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

export default withAnalytics(Button);
