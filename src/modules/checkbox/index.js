// @flow

import React from 'react';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '../analytics';

type Props = WithAnalyticsEventsProps & {
  defaultChecked: boolean,
  onChange: (e: MouseEvent) => void,
};

const Input = ({ createAnalyticsEvent, ...props }: Props) => (
  <input type="checkbox" {...props} />
);

export default withAnalyticsEvents({
  onChange: (createEvent, props) => {
    createEvent({ action: 'change', checked: !props.defaultChecked }).fire(
      'atlaskit',
    );
  },
})(Input);
