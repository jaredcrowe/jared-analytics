import React, { Component } from 'react';
import '@atlaskit/css-reset';

import { AnalyticsProvider, PageBoundary } from './modules/analytics';

import Issue from './components/Issue';

class App extends Component {
  render() {
    return (
      <AnalyticsProvider>
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
                      }))
                  ),
                'reporter-change': ({ fire }, event) =>
                  fire(
                    event
                      .rename('jira-issue-updated')
                      .enhance(payload => ({
                        ...payload,
                        field: 'reporter',
                      }))
                  ),
              }}
              analyticsNamespace="issue"
            />
          </div>
        </PageBoundary>
      </AnalyticsProvider>
    );
  }
}

export default App;
