// @flow

import cloneDeep from 'clone-deep';

import AnalyticsEvent from './AnalyticsEvent';
import type {
  AnalyticsEventUpdater,
  ObjectType,
  UIAnalyticsEventHandler,
  UIAnalyticsEventInterface,
  UIAnalyticsEventProps,
} from './types';

const noop = () => {};

const { warn } = console;

export default class UIAnalyticsEvent extends AnalyticsEvent
  implements UIAnalyticsEventInterface {
  context: Array<ObjectType>;
  handlers: Array<UIAnalyticsEventHandler>;
  hasFired: boolean;

  constructor(props: UIAnalyticsEventProps) {
    super(props);
    this.context = props.context || [];
    this.handlers = props.handlers || [{ handler: noop }];
    this.hasFired = false;
  }

  clone = (): UIAnalyticsEvent | null => {
    if (this.hasFired) {
      warn("Cannot clone an event after it's been fired.");
      return null;
    }
    const action = this.action;
    const context = [...this.context];
    const handlers = [...this.handlers];
    const payload = cloneDeep(this.payload);
    return new UIAnalyticsEvent({ action, context, handlers, payload });
  };

  fire = (channel?: string) => {
    if (this.hasFired) {
      warn('Cannot fire an event twice.');
      return;
    }

    const handlers = this.handlers.filter(
      ({ channel: listenerChannel }) =>
        channel === listenerChannel || listenerChannel === '*',
    );

    if (!handlers.length) {
      warn(
        `An event was fired on the '${
          typeof channel === 'string' ? channel : 'undefined'
        }' channel, but there are no listeners on this channel.`,
      );
    }

    handlers.forEach(({ handler }) => handler(this, channel));
    this.hasFired = true;
  };

  update(updater: AnalyticsEventUpdater): this {
    if (this.hasFired) {
      warn("Cannot update an event after it's been fired.");
      return this;
    }
    return super.update(updater);
  }
}
