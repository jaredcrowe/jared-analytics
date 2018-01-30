// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../analytics';
import { type InternalAnalyticsProps } from '../analytics/withAnalytics';

type ButtonProps = {
  onClick: (e: MouseEvent) => void,
} & InternalAnalyticsProps;

class Button extends Component<ButtonProps> {
  handleClick = e => {
    const { createAnalyticsEvent } = this.props;
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

export default withAnalytics({
  onClick: 'click',
})(Button);

export const ButtonWithCreateEventCallback = withAnalytics({
  onClick: (createEvent, props) => createEvent('click', {
    createdWithCustomFn: true,
    myOwnNamespace: props.analyticsNamespace,
    allProps: props,
  })
})(Button);

export const ButtonFireOnly = withAnalytics({
  onClick: (createEvent) => createEvent('click').fire(),
})(Button);