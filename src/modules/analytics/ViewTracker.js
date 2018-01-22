// @flow

import { Component } from 'react';

import withAnalytics from './withAnalytics';

class ViewTracker extends Component {
  componentDidMount() {
    const { createAnalyticsEvent, page } = this.props;
    createAnalyticsEvent('page-view', { page }).fire('jira');
  }

  render() { return null; }
}

export default withAnalytics(ViewTracker);
