// @flow

export type FireAnalyticsEvent = (event: AnalyticsEvent, channel?: string) => void;
export type RaiseAnalyticsEvent = (event: AnalyticsEvent) => void;
export type EventEnhancer = ((payload: {}) => {}) | {};

export default class AnalyticsEvent {
  name: string;
  payload: {};
  meta: {};
  fireCallback: FireAnalyticsEvent;
  raiseCallback: RaiseAnalyticsEvent;

  constructor(name: string, payload: {}, meta: {}, { fire: fireCallback, raise: raiseCallback }: { fire: FireAnalyticsEvent, raise: RaiseAnalyticsEvent}) {
    this.name = name;
    this.payload = payload;
    this.meta = meta;
    this.fireCallback = fireCallback;
    this.raiseCallback = raiseCallback;
  }

  rename = (name: string) => {
    this.name = name;
    return this;
  }

  enhance = (enhancer: EventEnhancer) => {
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

  fire = (channel?: string) => {
    this.fireCallback(this, channel);
  }

  raise = () => {
    this.raiseCallback(this);
  }
}
