// @flow

import React, { Component } from 'react';

import { AnalyticsContext, UIAnalyticsEvent } from '../modules/analytics';
import Button from '../modules/button';

import UserSelect from './UserSelect';

type Props = {
  issueId: number,
};

type State = {
  assignee: ?string,
  reporter: ?string,
};

const mockReduxAddCommentAction = async analyticsEvent => {
  const commentId = await new Promise(resolve =>
    window.setTimeout(() => resolve(Math.round(Math.random() * 1000)), 1000),
  );
  analyticsEvent
    .update({ action: 'comment-create-successful', commentId })
    .fire('jira');
};

export default class Issue extends Component<Props, State> {
  state = {
    assignee: null,
    reporter: null,
  };

  addComment = (e: Event, analyticsEvent: UIAnalyticsEvent) => {
    analyticsEvent.update(payload => ({
      ...payload,
      originalAction: payload.action,
      action: 'comment-create-requested',
    }));
    const pessimisticAnalyticsEvent = analyticsEvent.clone();
    analyticsEvent.fire('jira');
    mockReduxAddCommentAction(pessimisticAnalyticsEvent);
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
    event.update({ action: 'issue-updated', field, issueId }).fire('jira');
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
          <h3>Add comment</h3>
          <p>
            This is a mock Add comment button that demonstrates how we can
            optimistically fire an event as soon as an action is taken, then
            pessimistically fire another event with more data once it has
            succeeded.
          </p>
          <Button
            analyticsContext={{ namespace: 'add-comment-button' }}
            onClick={this.addComment}
          >
            Add comment
          </Button>
        </div>
      </AnalyticsContext>
    );
  }
}
