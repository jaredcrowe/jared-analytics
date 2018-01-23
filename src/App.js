import React, { Component } from 'react';
import '@atlaskit/css-reset';

import { AnalyticsListener, PageBoundary } from './modules/analytics';

import Issue from './components/Issue';

class App extends Component {
  render() {
    return (
      <AnalyticsListener
        channel="atlaskit"
        onEvent={event => console.log('Received Atlaskit event:', event)}
      >
        <AnalyticsListener
          channel="jira"
          onEvent={event => console.log('Received Jira event:', event)}
        >
          <PageBoundary analyticsNamespace="backlog">
            <div style={{ padding: '40px' }}>
              <Issue
                analytics={{
                  'assignee-change': ({ fire }, event) =>
                    fire(
                      event
                        .rename('jira-issue-updated')
                        .enhance(payload => ({
                          ...payload,
                          field: 'assignee',
                        })),
                      'jira'
                    ),
                  'reporter-change': ({ fire }, event) =>
                    fire(
                      event
                        .rename('jira-issue-updated')
                        .enhance(payload => ({
                          ...payload,
                          field: 'reporter',
                        })),
                      'jira'
                    ),
                }}
                analyticsNamespace="issue"
              />
            </div>
          </PageBoundary>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}

export default App;
