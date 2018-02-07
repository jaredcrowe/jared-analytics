// @flow

import React, { Component, type ComponentType } from 'react';
import PropTypes from 'prop-types';

import UIAnalyticsEvent from './UIAnalyticsEvent';
import type { AnalyticsEventPayload, ObjectType } from './types';

export type CreateUIAnalyticsEventSignature = (
  name: string,
  payload?: AnalyticsEventPayload,
) => UIAnalyticsEvent;

export type WithAnalyticsEventsProps = {
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

export default function withAnalyticsEvents<ProvidedProps: ObjectType>(
  createEventMap: EventMap<ProvidedProps> = {},
) {
  return (WrappedComponent: ComponentType<ProvidedProps>) =>
    class WithAnalyticsEvents extends Component<ProvidedProps> {
      static contextTypes = {
        getAtlaskitAnalyticsEventHandlers: PropTypes.func,
        getAtlaskitAnalyticsContext: PropTypes.func,
      };

      createAnalyticsEvent = (
        action: string,
        payload?: ObjectType = {},
      ): UIAnalyticsEvent => {
        const {
          getAtlaskitAnalyticsEventHandlers,
          getAtlaskitAnalyticsContext,
        } = this.context;
        const context =
          (typeof getAtlaskitAnalyticsContext === 'function' &&
            getAtlaskitAnalyticsContext()) ||
          [];
        const handlers =
          (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
            getAtlaskitAnalyticsEventHandlers()) ||
          [];
        return new UIAnalyticsEvent({ action, context, handlers, payload });
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
