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
                'assignee-change': ({ fire }, payload) =>
                  fire('jira-issue-updated', {
                    ...payload,
                    field: 'assignee',
                  }),
                'reporter-change': ({ fire }, payload) =>
                  fire('jira-issue-updated', {
                    ...payload,
                    field: 'reporter',
                  }),
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
