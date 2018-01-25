// @flow

import React, { Component, type ComponentType, type ElementConfig } from 'react';
import PropTypes from 'prop-types';

import AnalyticsEvent, { type RaiseAnalyticsEvent } from './AnalyticsEvent';

const noop = (...args: any) => {};

type RenamedEvent = string;
type CallbackPropName = string;
type RaisedEventHandler = (event: AnalyticsEvent, raise: RaiseAnalyticsEvent) => void;
type CreateAnalyticsEvent = (name: string, payload?: {}) => AnalyticsEvent;

type CreateEventMethod<P> = (createEvent: CreateAnalyticsEvent, props: P) => AnalyticsEvent;
type CreateEventMap<P> = {
  [propCallbackName: string]: string | CreateEventMethod<P>,
}

export type InternalAnalyticsProps = {
  createAnalyticsEvent: CreateAnalyticsEvent,
}

type ExternalAnalyticsProps = {
  analyticsNamespace?: string,
  analytics?: {
    [raisedEventName: string]: RenamedEvent | RaisedEventHandler,
  },
  bindEventsToProps?: {
    [eventName: string]: CallbackPropName,
  },
}

// Tried to get flow typing working but could not :O
export default <Props: ExternalAnalyticsProps>
  (createEventMap: CreateEventMap <Props> = { }) => (WrappedComponent: ComponentType<Props>): ComponentType<Props> =>
    class WithAnalytics extends Component<Props> {
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

      enqueuedEvents = []

      getChildContext = () => ({
        raiseAnalyticsEvent: this.raiseAnalyticsEvent,
        getAnalyticsPath: this.getAnalyticsPath,
      })

      getAnalyticsPath = () => {
        const { analyticsNamespace } = this.props;
        const ancestorNamespaces =
          (typeof this.context.getAnalyticsPath === 'function'
            && this.context.getAnalyticsPath())
          || [];
        return analyticsNamespace
          ? [...ancestorNamespaces, analyticsNamespace]
          : ancestorNamespaces;
      }

      createAnalyticsEvent = (name: string, payload: {} = {}) => {
        const meta = { path: this.getAnalyticsPath() };
        const fire = this.context.fireAnalyticsEvent || noop;
        const raise = this.raiseAnalyticsEvent;
        return new AnalyticsEvent(name, payload, meta, { fire, raise });
      }

      raiseAnalyticsEvent = (event: AnalyticsEvent) => {
        // If this event is bound to a prop callback, defer it and pass it in when
        // that callback is fired.
        if (Object.keys(this.props.bindEventsToProps).includes(event.name)) {
          this.enqueueEvent(event);
          return;
        }

        const raise = this.context.raiseAnalyticsEvent || noop;
        const { analytics: analyticsMap } = this.props;

        // If we don't know or care about this event simply re-raise it.
        if (!analyticsMap || !analyticsMap[event.name]) {
          raise(event);
          return;
        }

        // If the user has provided a function to handle this event, call it with
        // the event and the raise function.
        if (typeof analyticsMap[event.name] === 'function') {
          analyticsMap[event.name](event, raise);
        }

        // The user is also allowed to pass a string as the handler. This is
        // shorthand which tells us to rename the event to the provided string,
        // then raise the event automatically.
        if (typeof analyticsMap[event.name] === 'string') {
          event.rename(analyticsMap[event.name]);
          raise(event);
        }
      }

      enqueueEvent = (event: AnalyticsEvent) => {
        this.enqueuedEvents = [
          event,
          ...this.enqueuedEvents,
        ];
      }

      getEnqueuedEvent = (eventName: string) => {
        const event = this.enqueuedEvents.find(e => e.name === eventName);
        this.enqueuedEvents = this.enqueuedEvents
          .filter(e => e.name !== eventName);
        return event;
      }

      // Consumers can tell us that certain analytics events are inherently bound
      // to a callback prop. This means that whenever the event is raised we
      // should capture it and pass it as an extra argument to that callback prop,
      // rather than letting the consumer handle the event as normal.
      bindEventsToProps = (props: Props): Props => {
        const bindEventsMap = props.bindEventsToProps;
        if (!bindEventsMap) {
          return props;
        }

        const boundPropCallbacks = Object.keys(bindEventsMap)
          .reduce((bound, eventName) => {
            const propName = bindEventsMap[eventName];
            const providedCallback = props[propName];
            if (!providedCallback) {
              return bound;
            }
            const boundCallback = (...args) => {
              const event = this.getEnqueuedEvent(eventName);
              providedCallback(...args, event);
            };
            return {
              ...bound,
              [propName]: boundCallback,
            };
          }, {});

        return (({ ...props, ...boundPropCallbacks }: any): Props);
      }

      // Consumers can provide a map of callbacks to event creators to allow creating events
      // within certain components.
        mapCreateEventsToProps = (props: Props): Props => {
        if (!createEventMap) {
          return props;
        }

        const modifiedPropCallbacks = Object.keys(createEventMap)
          .reduce((modified, propCallbackName) => {
            const eventCreator = createEventMap[propCallbackName];
            const providedCallback = props[propCallbackName];
            if (!providedCallback) {
              return modified;
            }
            const modifiedCallback = (...args) => {
              if (typeof eventCreator === 'string') {
                this.createAnalyticsEvent(eventCreator).raise();
              } else if (typeof eventCreator === 'function') {
                eventCreator(this.createAnalyticsEvent, props).raise();
              } else {
                console.error('Invalid event creator type passed to withAnalytics event map');
              }
              providedCallback(...args);
            };
            return {
              ...modified,
              [propCallbackName]: modifiedCallback,
            };
          }, {});

        return (({ ...props, ...modifiedPropCallbacks }: any): Props);
      }

      render() {
        const patchedProps = this.mapCreateEventsToProps(this.bindEventsToProps(this.props));

        const {
          analyticsNamespace,
          analytics,
          bindEventsToProps,
          ...permittedProps
        } = patchedProps;

        const props = {
          ...permittedProps,
          ...patchedProps,
          createAnalyticsEvent: this.createAnalyticsEvent,
        };

        return (
          <WrappedComponent {...props} />
        );
      }
    }