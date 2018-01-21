// @flow

import React, { Component } from 'react';

import withAnalytics from './withAnalytics';
import ViewTracker from './ViewTracker';

class PageBoundary extends Component {
  render() {
    const { analyticsNamespace, children } = this.props;
    return (
      <div>
        <ViewTracker page={analyticsNamespace} />
        {children}
      </div>
    );
  }
}

export default withAnalytics(PageBoundary);
