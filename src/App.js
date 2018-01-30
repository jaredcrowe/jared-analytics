import React, { Component } from 'react';
import '@atlaskit/css-reset';

import { AnalyticsListener } from './modules/analytics';

import Issue from './components/Issue';
import { PageBoundary } from './components/analytics';

class App extends Component {
  render() {
    return (
      <AnalyticsListener onEvent={event => console.log('Received event:', event)}>
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
                <Issue analyticsNamespace="issue" issueId={123} />
              </div>
            </PageBoundary>
          </AnalyticsListener>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}

export default App;
