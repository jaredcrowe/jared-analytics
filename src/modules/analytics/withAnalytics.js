// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AnalyticsEvent from './AnalyticsEvent';

const noop = () => { };

export default (WrappedComponent, bindEvents = {}) =>
  class WithAnalytics extends Component<*> {
    static defaultProps = {
      analyticsNamespace: null,
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

    createAnalyticsEvent = (name, payload = {}) => {
      const meta = { path: this.getAnalyticsPath() };
      const fire = this.context.fireAnalyticsEvent || noop;
      return new AnalyticsEvent(name, payload, meta, fire);
    }

    raiseAnalyticsEvent = event => {
      // If this event is bound to a prop callback, defer it and pass it in when
      // that callback is fired.
      if (Object.keys(bindEvents).includes(event.name)) {
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

    enqueueEvent = event => {
      this.enqueuedEvents = [
        event,
        ...this.enqueuedEvents,
      ];
    }

    getEnqueuedEvent = eventName => {
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
      if (!bindEvents) {
        return this.props;
      }

      return Object.keys(bindEvents)
        .reduce((bound, eventName) => {
          const propName = bindEvents[eventName];
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
      const props = {
        ...this.props,
        ...this.bindEventsToProps(),
        createAnalyticsEvent: this.createAnalyticsEvent,
        raiseAnalyticsEvent: this.raiseAnalyticsEvent,
      };

      return (
        <WrappedComponent {...props} />
      );
    }
  };
