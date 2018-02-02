// @flow

import React, { Component } from 'react';

import { AnalyticsContext, UIAnalyticsEvent } from '../modules/analytics';

import UserSelect from './UserSelect';

type Props = {
  issueId: number,
};

type State = {
  assignee: ?string,
  reporter: ?string,
};

export default class Issue extends Component<Props, State> {
  state = {
    assignee: null,
    reporter: null,
  };

  onAssigneeChange = (user: string, analyticsEvent: UIAnalyticsEvent) => {
    this.setState({ assignee: user });
    this.onEvent(analyticsEvent, 'assignee');
  };

  onReporterChange = (user: string, analyticsEvent: UIAnalyticsEvent) => {
    this.setState({ reporter: user });
    this.onEvent(analyticsEvent, 'reporter');
  };

  onEvent = (event: UIAnalyticsEvent, field: string) => {
    const { issueId } = this.props;
    event.update({ field, issueId }).fire('jira');
  };

  render() {
    const { issueId } = this.props;
    return (
      <AnalyticsContext data={{ issueId, namespace: 'issue' }}>
        <div>
          <h3>Assignee:</h3>
          <div>
            <UserSelect
              // NOTE: We're overwriting this UserSelect's default context here
              analyticsContext={{ namespace: 'assignee-select' }}
              value={this.state.assignee}
              onChange={this.onAssigneeChange}
            />
          </div>
          <h3>Reporter:</h3>
          <div>
            <UserSelect
              // Down here we're letting it default to { namespace: 'user-select' }
              value={this.state.reporter}
              onChange={this.onReporterChange}
            />
          </div>
        </div>
      </AnalyticsContext>
    );
  }
}
