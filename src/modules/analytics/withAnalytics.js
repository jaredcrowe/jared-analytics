// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const noop = () => {};

export default WrappedComponent =>
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

    getChildContext = () => ({
      raiseAnalyticsEvent: this.raiseAnalyticsEvent,
      analyticsPath: this.getAnalyticsPath(),
    });

    raiseAnalyticsEvent = (eventName, eventPayload) => {
      const { analytics: analyticsMap } = this.props;
      if (!analyticsMap || !analyticsMap[eventName]) {
        return;
      }

      const raise = this.context.raiseAnalyticsEvent || noop;
      const fire = this.context.fireAnalyticsEvent || noop;

      if (typeof analyticsMap[eventName] === 'function') {
        analyticsMap[eventName]({ fire, raise }, eventPayload);
      }

      if (typeof analyticsMap[eventName] === 'string') {
        raise(analyticsMap[eventName], eventPayload);
      }
    };

    getAnalyticsPath = () => {
      const { analyticsNamespace } = this.props;
      const ancestorNamespace = this.context.analyticsPath || [];
      return analyticsNamespace
        ? [...ancestorNamespace, analyticsNamespace]
        : ancestorNamespace;
    };

    render() {
      return (
        <WrappedComponent
          raiseAnalyticsEvent={this.raiseAnalyticsEvent}
          fireAnalyticsEvent={this.context.fireAnalyticsEvent}
          analyticsPath={this.getAnalyticsPath()}
          {...this.props}
        />
      );
    }
  };
