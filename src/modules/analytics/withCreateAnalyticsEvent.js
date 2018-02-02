// @flow

import React, { Component, type ComponentType } from 'react';
import PropTypes from 'prop-types';

import UIAnalyticsEvent from './UIAnalyticsEvent';
import type { AnalyticsEventPayload, ObjectType } from './types';

export type CreateUIAnalyticsEventSignature = (
  name: string,
  payload?: AnalyticsEventPayload,
) => UIAnalyticsEvent;

export type WithCreateAnalyticsEventProps = {
  createAnalyticsEvent: CreateUIAnalyticsEventSignature,
};

type EventMap<ProvidedProps> = {
  [string]:
    | string
    | ((
        create: CreateUIAnalyticsEventSignature,
        props: ProvidedProps,
      ) => UIAnalyticsEvent | void),
};

export default function withCreateAnalyticsEvent<ProvidedProps: ObjectType>(
  createEventMap: EventMap<ProvidedProps> = {},
) {
  return (WrappedComponent: ComponentType<ProvidedProps>) =>
    class WithCreateAnalyticsEvent extends Component<ProvidedProps> {
      static contextTypes = {
        getAnalyticsEventHandlers: PropTypes.func,
        getAnalyticsContext: PropTypes.func,
      };

      createAnalyticsEvent = (
        action: string,
        payload?: ObjectType = {},
      ): UIAnalyticsEvent => {
        const { getAnalyticsEventHandlers, getAnalyticsContext } = this.context;
        const context = getAnalyticsContext() || [];
        const handlers = getAnalyticsEventHandlers();
        return new UIAnalyticsEvent({ action, context, payload, handlers });
      };

      mapCreateEventsToProps = () => {
        const patchedProps = Object.keys(createEventMap).reduce(
          (modified, propCallbackName) => {
            const eventCreator = createEventMap[propCallbackName];
            const providedCallback = this.props[propCallbackName];
            if (
              !providedCallback ||
              !['string', 'function'].includes(typeof eventCreator)
            ) {
              return modified;
            }
            const modifiedCallback = (...args) => {
              const analyticsEvent =
                typeof eventCreator === 'function'
                  ? eventCreator(this.createAnalyticsEvent, this.props)
                  : this.createAnalyticsEvent(eventCreator);

              providedCallback(...args, analyticsEvent);
            };
            return {
              ...modified,
              [propCallbackName]: modifiedCallback,
            };
          },
          {},
        );

        return { ...this.props, ...patchedProps };
      };

      render() {
        const patchedProps = this.mapCreateEventsToProps();
        return (
          <WrappedComponent
            {...patchedProps}
            createAnalyticsEvent={this.createAnalyticsEvent}
          />
        );
      }
    };
}
