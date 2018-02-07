// @flow

import React, { Component } from 'react';

import {
  withAnalyticsContext,
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '../analytics';

type Props = WithAnalyticsEventsProps & {
  onClick: (e: MouseEvent) => void,
};

class Button extends Component<Props, void> {
  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} />;
  }
}

export default withAnalyticsContext({ namespace: 'button' })(
  withAnalyticsEvents({
    onClick: createEvent => {
      createEvent('click', { version: '1.0.0' }).fire('atlaskit');
      return createEvent('click');
    },
  })(Button),
);
