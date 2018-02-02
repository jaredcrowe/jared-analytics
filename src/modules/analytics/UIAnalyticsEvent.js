// @flow

import AnalyticsEvent from './AnalyticsEvent';
import type {
  AnalyticsEventUpdater,
  ObjectType,
  UIAnalyticsEventHandlerSignature,
  UIAnalyticsEventInterface,
  UIAnalyticsEventProps,
} from './types';

const noop = () => {};

const sendHasFiredWarning = () =>
  // eslint-disable-next-line no-console
  console.warn(
    "This event has already been fired. It's not possible to fire the same event twice.",
  );

export default class UIAnalyticsEvent extends AnalyticsEvent
  implements UIAnalyticsEventInterface {
  context: Array<ObjectType>;
  handlers: Array<UIAnalyticsEventHandlerSignature>;
  hasFired: boolean;

  constructor(props: UIAnalyticsEventProps) {
    super(props);
    this.context = props.context || [];
    this.handlers = props.handlers || [noop];
    this.hasFired = false;
  }

  fire = (channel?: string) => {
    if (this.hasFired) {
      sendHasFiredWarning();
      return;
    }
    this.handlers.forEach(handler => {
      handler(this, channel);
    });
    this.hasFired = true;
  };

  update(updater: AnalyticsEventUpdater): this {
    if (this.hasFired) {
      sendHasFiredWarning();
      return this;
    }
    return super.update(updater);
  }
}
