// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';

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

  render() {
    return (
      <div>
        <h3>Assignee:</h3>
        <div>
          <UserSelect
            analytics={{
              select: ({ raise }, event) => raise(
                event.rename('assignee-change')
              ),
            }}
            analyticsNamespace="assignee-select"
            selectedUser={this.state.assignee}
            onSelected={this.onAssigneeSelected}
          />
        </div>
        <h3>Reporter:</h3>
        <div>
          <UserSelect
            analytics={{
              select: ({ raise }, event) => raise(
                event.rename('reporter-change')
              ),
            }}
            analyticsNamespace="reporter-select"
            selectedUser={this.state.reporter}
            onSelected={this.onReporterSelected}
          />
        </div>
      </div>
    );
  }
}

export default withAnalytics(Issue);
