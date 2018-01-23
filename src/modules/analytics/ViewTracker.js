// @flow

import { Component } from 'react';

import withAnalytics from './withAnalytics';

class ViewTracker extends Component {
  componentDidMount() {
    const { createAnalyticsEvent, fireAnalyticsEvent, page } = this.props;
    fireAnalyticsEvent(
      createAnalyticsEvent('page-view', { page }),
      'jira'
    );
  }

  render() { return null; }
}

export default withAnalytics(ViewTracker);
