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
  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} />;
  }
}

export default withAnalyticsContext({ namespace: 'button' })(
  withCreateAnalyticsEvent({
    onClick: createEvent => {
      createEvent('click', { version: '1.0.0' }).fire('atlaskit');
      return createEvent('click');
    },
  })(Button),
);
