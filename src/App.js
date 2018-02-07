// @flow

import React, { Component } from 'react';
import '@atlaskit/css-reset'; // eslint-disable-line import/extensions

import { AnalyticsContext, AnalyticsListener } from './modules/analytics';

import sendAnalyticsEventToBackend from './sendAnalyticsEventToBackend';
import FetchData from './components/FetchData';
import Issue from './components/Issue';

const sendAnalyticsEventToGrowth = (event, channel) =>
  // eslint-disable-next-line no-console
  console.log(`Snooped on event on ${channel || 'undefined'} channel:`, event);

export default class App extends Component<void> {
  render() {
    return (
      <AnalyticsListener channel="*" onEvent={sendAnalyticsEventToGrowth}>
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
                <Issue issueId={123} />
                <FetchData />
              </div>
            </AnalyticsContext>
          </AnalyticsListener>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}
