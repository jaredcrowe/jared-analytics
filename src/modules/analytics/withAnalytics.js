// @flow

import React, { Component, type ComponentType } from 'react';
import PropTypes from 'prop-types';

import AnalyticsEvent, { type RaiseAnalyticsEvent } from './AnalyticsEvent';

const noop = (...args: any) => {};

type RenamedEvent = string;
type CallbackPropName = string;
type RaisedEventHandler = (event: AnalyticsEvent, raise: RaiseAnalyticsEvent) => void;

export type withAnalyticsProps = {
  createAnalyticsEvent: (name: string, payload: {}) => AnalyticsEvent,
}

type Props = withAnalyticsProps & {
  analyticsNamespace: string,
  analytics?: {
    [raisedEventName: string]: RenamedEvent | RaisedEventHandler,
  },
  bindEventsToProps: {
    [eventName: string]: CallbackPropName,
  },
}

export default (WrappedComponent: ComponentType<Props>) =>
  class WithAnalytics extends Component<$Diff<Props, withAnalyticsProps>> {
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
    bindEventsToProps = () => {
      const bindEventsMap = this.props.bindEventsToProps;
      if (!bindEventsMap) {
        return this.props;
      }

      return Object.keys(bindEventsMap)
        .reduce((bound, eventName) => {
          const propName = bindEventsMap[eventName];
          const providedCallback = this.props[propName];
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
    }

    render() {
      const {
        analyticsNamespace,
        ...permittedProps
      } = this.props;

      const props = {
        ...permittedProps,
        ...this.bindEventsToProps(),
        createAnalyticsEvent: this.createAnalyticsEvent,
      };

      return (
        <WrappedComponent {...props} />
      );
    }
  };
