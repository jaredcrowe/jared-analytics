// @flow

import { Component } from 'react';

import withAnalytics from './withAnalytics';

class PageBoundary extends Component {
  render() {
    return this.props.children;
  }
}

export default withAnalytics(PageBoundary);
