// @flow

import React, { Component } from 'react';

import { AnalyticsBoundary } from '../modules/analytics';

import UserSelect from './UserSelect';

export default class Issue extends Component<*> {
  state = {
    assignee: null,
    reporter: null,
  }

  onAssigneeChange = (user: string) => {
    this.setState({ assignee: user });
  }

  onReporterChange = (user: string) => {
    this.setState({ reporter: user });
  }

  onEvent = event => {
    const { issueId } = this.props;
    switch (event.name) {
      case 'assignee-change':
        event
          .rename('jira-issue-updated')
          .enhance({ field: 'assignee', issueId })
          .fire('jira');
        break;
      case 'reporter-change':
        event
          .rename('jira-issue-updated')
          .enhance({ field: 'reporter', issueId })
          .fire('jira');
        break;
      default:
        event.fire('jira');
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
            value={this.state.assignee}
            onChange={this.onAssigneeChange}
          />
        </div>
        <h3>Reporter:</h3>
        <div>
          <UserSelect
            analytics={{ select: 'reporter-change' }}
            analyticsNamespace="reporter-select"
            useEventCallbackButton
            value={this.state.reporter}
            onChange={this.onReporterChange}
          />
        </div>
      </AnalyticsBoundary>
    );
  }
}
