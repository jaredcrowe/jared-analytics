// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../analytics';

class Button extends Component<*> {
  handleClick = e => {
    const {
      createAnalyticsEvent,
      raiseAnalyticsEvent,
    } = this.props;

    raiseAnalyticsEvent(createAnalyticsEvent('click'));

    createAnalyticsEvent('atlaskit-button-click', { version: '1.0.0' })
      .fire('atlaskit');

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const {
      onClick,
      createAnalyticsEvent,
      raiseAnalyticsEvent,
      analyticsNamespace,
      ...rest
    } = this.props;
    return <button {...rest} onClick={this.handleClick} />;
  }
}

export default withAnalytics(Button, { click: 'onClick' });
// export default withAnalytics(Button);
