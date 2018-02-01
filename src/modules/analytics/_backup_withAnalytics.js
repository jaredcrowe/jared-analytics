/* eslint-ignore */

import React, { Component, type ComponentType } from 'react';
import PropTypes from 'prop-types';

import UIAnalyticsEvent from './UIAnalyticsEvent';
import withAnalyticsContext from './withAnalyticsContext';
import type {
  UIAnalyticsEventInterface,
  CreateUIAnalyticsEventSignature,
  FireUIAnalyticsEventSignature,
  RaiseUIAnalyticsEventSignature,
  RaisedEventHandlerSignature,
  ObjectType,
} from './types';

const noop:
  | FireUIAnalyticsEventSignature
  | RaiseUIAnalyticsEventSignature = () => {};

export type InternalAnalyticsProps = {
  createAnalyticsEvent: CreateUIAnalyticsEventSignature,
};

type ExternalAnalyticsProps = {
  analyticsNamespace?: string,
  analytics?: {
    [raisedEventName: string]: string | RaisedEventHandlerSignature,
  },
  bindEventsToProps?: {
    [eventName: string]: string,
  },
};

type EventMap<ProvidedProps> = {
  [string]:
    | string
    | ((
        create: CreateUIAnalyticsEventSignature,
        props: ExternalAnalyticsProps & ProvidedProps,
      ) => UIAnalyticsEventInterface | void),
};

export default function withAnalytics<ProvidedProps: ObjectType>(
  createEventMap: EventMap<ProvidedProps> = {},
) {
  return (WrappedComponent: ComponentType<ProvidedProps>) =>
    class WithAnalytics extends Component<ProvidedProps> {
      static defaultProps = {
        analyticsNamespace: null,
        bindEventsToProps: {},
      };

      static contextTypes = {
        fireAnalyticsEvent: PropTypes.func,
        raiseAnalyticsEvent: PropTypes.func,
        getAnalyticsPath: PropTypes.func,
      };

      static childContextTypes = {
        raiseAnalyticsEvent: PropTypes.func,
        getAnalyticsPath: PropTypes.func,
      };

      enqueuedEvents = [];

      getChildContext = () => ({
        raiseAnalyticsEvent: this.raiseAnalyticsEvent,
        getAnalyticsPath: this.getAnalyticsPath,
      });

      getAnalyticsPath = () => {
        const { analyticsNamespace } = this.props;
        const ancestorNamespaces =
          (typeof this.context.getAnalyticsPath === 'function' &&
            this.context.getAnalyticsPath()) ||
          [];
        return analyticsNamespace
          ? [...ancestorNamespaces, analyticsNamespace]
          : ancestorNamespaces;
        return (
          (typeof this.context.getAnalyticsPath === 'function' &&
            this.context.getAnalyticsPath()) ||
          []
        );
      };

      createAnalyticsEvent = (action: string, payload: {} = {}) => {
        const meta = { path: this.getAnalyticsPath() };
        const fireCallback = this.context.fireAnalyticsEvent || noop;
        // const raiseCallback = this.raiseAnalyticsEvent;
        return new UIAnalyticsEvent({
          action,
          payload,
          // meta,
          context: [],
          fireCallback,
          // raiseCallback: noop,
        });
      };

      raiseAnalyticsEvent = (event: UIAnalyticsEventInterface) => {
        // If this event is bound to a prop callback, defer it and pass it in when
        // that callback is fired.
        if (Object.keys(this.props.bindEventsToProps).includes(event.action)) {
          this.enqueueEvent(event);
          return;
        }

        const raise = this.context.raiseAnalyticsEvent || noop;
        const { analytics: analyticsMap } = this.props;

        // If we don't know or care about this event simply re-raise it.
        if (!analyticsMap || !analyticsMap[event.action]) {
          raise(event);
          return;
        }

        // If the user has provided a function to handle this event, call it with
        // the event and the raise function.
        if (typeof analyticsMap[event.action] === 'function') {
          analyticsMap[event.action](event, raise);
        }

        // The user is also allowed to pass a string as the handler. This is
        // shorthand which tells us to rename the event to the provided string,
        // then raise the event automatically.
        if (typeof analyticsMap[event.action] === 'string') {
          event.rename(analyticsMap[event.action]);
          raise(event);
        }
      };

      enqueueEvent = (event: UIAnalyticsEventInterface) => {
        this.enqueuedEvents = [event, ...this.enqueuedEvents];
      };

      getEnqueuedEvent = (eventAction: string) => {
        const event = this.enqueuedEvents.find(e => e.action === eventAction);
        this.enqueuedEvents = this.enqueuedEvents.filter(
          e => e.action !== eventAction,
        );
        return event;
      };

      Consumers can tell us that certain analytics events are inherently bound
      to a callback prop. This means that whenever the event is raised we
      should capture it and pass it as an extra argument to that callback prop,
      rather than letting the consumer handle the event as normal.
      bindEventsToProps = (props: ProvidedProps): ProvidedProps => {
        const bindEventsMap = props.bindEventsToProps;
        if (!bindEventsMap) {
          return props;
        }

        const boundPropCallbacks = Object.keys(bindEventsMap).reduce(
          (bound, eventAction) => {
            const propName = bindEventsMap[eventAction];
            const providedCallback = props[propName];
            if (!providedCallback) {
              return bound;
            }
            const boundCallback = (...args) => {
              const event = this.getEnqueuedEvent(eventAction);
              providedCallback(...args, event);
            };
            return {
              ...bound,
              [propName]: boundCallback,
            };
          },
          {},
        );

        return { ...props, ...boundPropCallbacks };
      };

      // Consumers can provide a map of callbacks to event creators to allow creating events
      // within certain components.
      mapCreateEventsToProps = (props: ProvidedProps): ProvidedProps => {
        if (!createEventMap) {
          return props;
        }

        const modifiedPropCallbacks = Object.keys(createEventMap).reduce(
          (modified, propCallbackName) => {
            const eventCreator = createEventMap[propCallbackName];
            const providedCallback = props[propCallbackName];
            if (!providedCallback) {
              return modified;
            }
            const modifiedCallback = (...args) => {
              if (typeof eventCreator === 'string') {
                this.createAnalyticsEvent(eventCreator).raise();
              } else if (typeof eventCreator === 'function') {
                const event = eventCreator(this.createAnalyticsEvent, props);
                if (event) event.raise();
              } else {
                // eslint-disable-next-line no-console
                console.error(
                  'Invalid event creator type passed to withAnalytics event map',
                );
              }
              providedCallback(...args);
            };
            return {
              ...modified,
              [propCallbackName]: modifiedCallback,
            };
          },
          {},
        );

        return { ...props, ...modifiedPropCallbacks };
      };

      render() {
        const patchedProps = this.mapCreateEventsToProps(
          this.bindEventsToProps(this.props),
        );

        const {
          analyticsNamespace,
          analytics,
          bindEventsToProps,
          ...permittedProps
        } = patchedProps;

        const props = {
          ...permittedProps,
          createAnalyticsEvent: this.createAnalyticsEvent,
        };

        return <WrappedComponent {...props} />;
      }
    };
}
