// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AnalyticsEvent from './AnalyticsEvent';

const noop = () => { };

export default (WrappedComponent, bindProps = []) =>
  class WithAnalytics extends Component<*> {
    static defaultProps = {
      analyticsNamespace: null,
    };

    static contextTypes = {
      fireAnalyticsEvent: PropTypes.func,
      raiseAnalyticsEvent: PropTypes.func,
      analyticsPath: PropTypes.array,
    };

    static childContextTypes = {
      raiseAnalyticsEvent: PropTypes.func,
      analyticsPath: PropTypes.array,
    };

    enqueuedCallbacks = [];

    getChildContext = () => ({
      raiseAnalyticsEvent: this.raiseAnalyticsEvent,
      analyticsPath: this.getAnalyticsPath(),
    });

    createAnalyticsEvent = (name, payload) =>
      new AnalyticsEvent(name, payload, {
        path: this.getAnalyticsPath(),
      })

    raiseAnalyticsEvent = (event) => {
      const { analytics: analyticsMap } = this.props;
      if (!analyticsMap || !analyticsMap[event.name]) {
        return;
      }

      this.triggerEnqueuedCallbacks(event);

      const raise = this.context.raiseAnalyticsEvent || noop;
      const fire = this.context.fireAnalyticsEvent || noop;

      if (typeof analyticsMap[event.name] === 'function') {
        analyticsMap[event.name]({ fire, raise }, event);
      }

      if (typeof analyticsMap[event.name] === 'string') {
        event.rename(analyticsMap[event.name]);
        raise(event);
      }
    };

    enqueueCallback = (eventName, trigger) => {
      this.enqueuedCallbacks = [
        ...this.enqueuedCallbacks,
        { eventName, trigger },
      ];
    }

    triggerEnqueuedCallbacks = (event) => {
      this.enqueuedCallbacks
        .filter(callback => callback.eventName === event.name)
        .forEach(callback => callback.trigger(event));

      this.enqueuedCallbacks = this.enqueuedCallbacks
        .filter(callback => callback.eventName !== event.name);
    }

    getAnalyticsPath = () => {
      const { analyticsNamespace } = this.props;
      const ancestorNamespace = this.context.analyticsPath || [];
      return analyticsNamespace
        ? [...ancestorNamespace, analyticsNamespace]
        : ancestorNamespace;
    };

    getBoundProps = () => {
      const boundProps = Object.keys(bindProps).reduce(
        (bound, propName) => ({
          ...bound,
          [propName]: (...args) => {
            this.enqueueCallback(
              bindProps[propName],
              event => this.props[propName](...args, event)
            )
          }
        }),
        {}
      );

      return {
        ...this.props,
        ...boundProps,
      };
    }

    render() {
      const boundProps = this.getBoundProps();

      return (
        <WrappedComponent
          createAnalyticsEvent={this.createAnalyticsEvent}
          raiseAnalyticsEvent={this.raiseAnalyticsEvent}
          fireAnalyticsEvent={this.context.fireAnalyticsEvent}
          {...boundProps}
        />
      );
    }
  };
