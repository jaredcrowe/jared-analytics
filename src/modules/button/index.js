// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../analytics';

class Button extends Component<*> {
  handleClick = e => {
    this.props.fireAnalyticsEvent('atlaskit-button-click', {
      source: this.props.analyticsPath,
      version: '1.0.0',
    });
    this.props.raiseAnalyticsEvent('click', {
      source: this.props.analyticsPath,
    });

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const {
      onClick,
      fireAnalyticsEvent,
      raiseAnalyticsEvent,
      analyticsPath,
      analyticsNamespace,
      ...rest
    } = this.props;
    return <button {...rest} onClick={this.handleClick} />;
  }
}

export default withAnalytics(Button);
