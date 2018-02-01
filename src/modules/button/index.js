// @flow

import React, { Component } from 'react';

import {
  withAnalyticsContext,
  withCreateAnalyticsEvent,
  type WithCreateAnalyticsEventProps,
} from '../analytics';

type Props = WithCreateAnalyticsEventProps & {
  onClick: (e: MouseEvent) => void,
};

class Button extends Component<Props, void> {
  handleClick = e => {
    const { createAnalyticsEvent } = this.props;
    createAnalyticsEvent('click', { version: '1.0.0' }).fire('atlaskit');

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

export default withAnalyticsContext({ namespace: 'button' })(
  withCreateAnalyticsEvent({ onClick: 'click' })(Button),
);
