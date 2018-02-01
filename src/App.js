// @flow
/* eslint-disable no-console */

import React, { Component } from 'react';
import '@atlaskit/css-reset'; // eslint-disable-line import/extensions

import { AnalyticsContext, AnalyticsListener } from './modules/analytics';

import sendAnalyticsEventToBackend from './sendAnalyticsEventToBackend';
import FetchData from './components/FetchData';
import Issue from './components/Issue';

class App extends Component<void> {
  render() {
    return (
      <AnalyticsListener onEvent={sendAnalyticsEventToBackend}>
        <AnalyticsListener
          channel="atlaskit"
          onEvent={sendAnalyticsEventToBackend}
        >
          <AnalyticsListener
            channel="jira"
            onEvent={sendAnalyticsEventToBackend}
          >
            <AnalyticsContext data={{ source: 'backlog', namespace: 'jira' }}>
              <div style={{ padding: '40px' }}>
                <Issue
                  // analyticsNamespace="issue"
                  issueId={123}
                />
                <FetchData />
              </div>
            </AnalyticsContext>
          </AnalyticsListener>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}

export default App;
