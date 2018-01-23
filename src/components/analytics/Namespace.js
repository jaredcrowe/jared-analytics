// @flow

import { Component } from 'react';

import { withAnalytics } from '../../modules/analytics';

/** A convenience component which allows you to drop a new analyticsNamespace
 * layer in the page without having to wrap anything in withAnalytics. */
class Namespace extends Component {
  render() {
    return this.props.children;
  }
}

export default withAnalytics(Namespace);
