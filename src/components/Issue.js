// @flow

import React, { Component } from 'react';

import { AnalyticsBoundary, withAnalytics } from '../modules/analytics';

import UserSelect from './UserSelect';

class Issue extends Component {
  state = {
    assignee: null,
    reporter: null,
  }

  onAssigneeSelected = (user: string) => {
    this.setState({
      assignee: user,
    });
    this.updateIssue('assignee', user);
  }

  onReporterSelected = (user: string) => {
    this.setState({
      reported: user,
    });
    this.updateIssue('reporter', user);
  }

  updateIssue = (fieldName, fieldValue) => {
    console.log(`APP_STATE_CHANGE: ${fieldName} changed to ${fieldValue}`);
  }

  onEvent = (event, raise) => {
    const { issueId } = this.props;
    switch (event.name) {
      case 'assignee-change':
        event
          .rename('jira-issue-updated')
          .enhance(payload => ({ ...payload, field: 'assignee', issueId }))
          .fire('jira');
        break;
      case 'reporter-change':
        event
          .rename('jira-issue-updated')
          .enhance(payload => ({ ...payload, field: 'reporter', issueId }))
          .fire('jira');
        break;
    }
  }

  render() {
    return (
      <AnalyticsBoundary onEvent={this.onEvent}>
        <h3>Assignee:</h3>
        <div>
          <UserSelect
            analytics={{ select: 'assignee-change' }}
            analyticsNamespace="assignee-select"
            selectedUser={this.state.assignee}
            onSelected={this.onAssigneeSelected}
          />
        </div>
        <h3>Reporter:</h3>
        <div>
          <UserSelect
            analytics={{ select: 'reporter-change' }}
            analyticsNamespace="reporter-select"
            selectedUser={this.state.reporter}
            onSelected={this.onReporterSelected}
          />
        </div>
      </AnalyticsBoundary>
    );
  }
}

export default withAnalytics(Issue);
