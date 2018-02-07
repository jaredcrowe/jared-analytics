// @flow

import React, { Component, type ComponentType } from 'react';

import AnalyticsContext from './AnalyticsContext';
import type { ObjectType } from './types';

export default function withAnalyticsContext<ProvidedProps: ObjectType>(
  defaultData?: ObjectType = {},
) {
  return (WrappedComponent: ComponentType<ProvidedProps>) =>
    class WithAnalyticsContext extends Component<ProvidedProps> {
      static defaultProps = {
        analyticsContext: defaultData,
      };

      render() {
        const { analyticsContext, ...props } = this.props;
        return (
          <AnalyticsContext data={analyticsContext}>
            <WrappedComponent {...props} />
          </AnalyticsContext>
        );
      }
    };
}
