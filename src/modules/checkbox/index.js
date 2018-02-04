// @flow

import React from 'react';
import {
  withCreateAnalyticsEvent,
  type WithCreateAnalyticsEventProps,
} from '../analytics';

type Props = WithCreateAnalyticsEventProps & {
  checked: boolean,
  onChange: (e: MouseEvent) => void,
};

const Input = ({ createAnalyticsEvent, ...props }: Props) => (
  <input type="checkbox" {...props} />
);

export default withCreateAnalyticsEvent({
  onChange: (createEvent, props) =>
    createEvent('change', { checked: !props.checked }),
})(Input);
