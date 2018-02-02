// @flow

import AnalyticsEvent from './AnalyticsEvent';
import type {
  UIAnalyticsEventHandlerSignature,
  ObjectType,
  UIAnalyticsEventInterface,
  UIAnalyticsEventProps,
} from './types';

const noop = () => {};

export default class UIAnalyticsEvent extends AnalyticsEvent
  implements UIAnalyticsEventInterface {
  context: Array<ObjectType>;
  handlers: Array<UIAnalyticsEventHandlerSignature>;

  constructor(props: UIAnalyticsEventProps) {
    super(props);
    this.context = props.context || [];
    this.handlers = props.handlers || [noop];
  }

  fire = (channel?: string) => {
    this.handlers.forEach(handler => {
      handler(this, channel);
    });
  };
}
