// @flow

import type {
  AnalyticsEventUpdater,
  AnalyticsEventInterface,
  AnalyticsEventProps,
} from './types';

export default class AnalyticsEvent implements AnalyticsEventInterface {
  action: string;
  payload: {};

  constructor(props: AnalyticsEventProps) {
    this.action = props.action;
    this.payload = props.payload;
  }

  update(updater: AnalyticsEventUpdater): this {
    if (typeof updater === 'function') {
      this.payload = updater(this.payload);
    } else if (typeof updater === 'object') {
      this.payload = {
        ...this.payload,
        ...updater,
      };
    }

    return this;
  }
}
