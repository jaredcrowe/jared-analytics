// @flow

import React, { Component } from 'react';

import Namespace from './Namespace';
import ViewTracker from './ViewTracker';

/** A convenience component which combines a Namespace and a ViewTracker. Useful
 * for declaring 'page boundaries'. */
export default class PageBoundary extends Component<*> {
  render() {
    const { analyticsNamespace, children } = this.props;
    return (
      <Namespace analyticsNamespace={analyticsNamespace}>
        <div>
          <ViewTracker page={analyticsNamespace} />
          {children}
        </div>
      </Namespace>
    );
  }
}
