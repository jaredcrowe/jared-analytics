// @flow

import AnalyticsEvent from './AnalyticsEvent';
import type {
  FireUIAnalyticsEventSignature,
  ObjectType,
  UIAnalyticsEventInterface,
  UIAnalyticsEventProps,
} from './types';

const noop = () => {};

export default class UIAnalyticsEvent extends AnalyticsEvent
  implements UIAnalyticsEventInterface {
  context: Array<ObjectType>;
  fireCallback: FireUIAnalyticsEventSignature;

  constructor(props: UIAnalyticsEventProps) {
    super(props);
    this.context = props.context || [];
    this.fireCallback = props.fireCallback || noop;
  }

  fire(channel?: string) {
    this.fireCallback(this, channel);
  }
}
