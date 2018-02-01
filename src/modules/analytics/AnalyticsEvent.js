// @flow

import type {
  AnalyticsEventEnhancer,
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

  enhance(enhancer: AnalyticsEventEnhancer): this {
    if (typeof enhancer === 'function') {
      this.payload = enhancer(this.payload);
    }

    // TODO: implement a smarter merge
    if (typeof enhancer === 'object') {
      this.payload = {
        ...this.payload,
        ...enhancer,
      };
    }

    return this;
  }
}
