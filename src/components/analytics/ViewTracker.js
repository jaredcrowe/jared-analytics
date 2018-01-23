// @flow

import { Component } from 'react';

import { withAnalytics } from '../../modules/analytics';

/** A convenience component which allows you to declaratively fire a page-view
 * event from anywhere in your render tree. */
class ViewTracker extends Component {
  componentDidMount() {
    const { createAnalyticsEvent, page } = this.props;
    createAnalyticsEvent('page-view', { page }).fire('jira');
  }

  render() { return null; }
}

export default withAnalytics(ViewTracker);
