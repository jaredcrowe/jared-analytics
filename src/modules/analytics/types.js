// @flow

import AnalyticsEvent from './AnalyticsEvent';
import UIAnalyticsEvent from './UIAnalyticsEvent';

// Utils
export type ObjectType = { [string]: any };

// Basic events
export type AnalyticsEventPayload = ObjectType;

export type AnalyticsEventEnhancer =
  | AnalyticsEventPayload
  | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload);

export type AnalyticsEventProps = {
  action: string,
  payload: {},
};

export interface AnalyticsEventInterface {
  action: string;
  payload: AnalyticsEventPayload;

  enhance(enhancer: AnalyticsEventEnhancer): AnalyticsEvent;
}

// UI events
type ChannelIdentifier = string;

export type FireUIAnalyticsEventSignature = (
  event: UIAnalyticsEvent,
  channel?: ChannelIdentifier,
) => void;

export type UIAnalyticsEventProps = AnalyticsEventProps & {
  context: Array<ObjectType>,
  fireCallback?: FireUIAnalyticsEventSignature,
};

export interface UIAnalyticsEventInterface extends AnalyticsEventInterface {
  context: Array<ObjectType>;
  fireCallback?: FireUIAnalyticsEventSignature;

  fire(channel?: ChannelIdentifier): void;
}
