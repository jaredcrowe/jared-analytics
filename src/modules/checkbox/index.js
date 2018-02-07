// @flow

import React from 'react';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '../analytics';

type Props = WithAnalyticsEventsProps & {
  checked: boolean,
  onChange: (e: MouseEvent) => void,
};

const Input = ({ createAnalyticsEvent, ...props }: Props) => (
  <input type="checkbox" {...props} />
);

export default withAnalyticsEvents({
  onChange: (createEvent, props) =>
    createEvent('change', { checked: !props.checked }),
})(Input);
