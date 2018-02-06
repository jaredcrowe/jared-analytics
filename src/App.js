// @flow

import React, { Component } from 'react';
import '@atlaskit/css-reset'; // eslint-disable-line import/extensions

import {
  AnalyticsContext,
  AnalyticsListener,
  withCreateAnalyticsEvent,
} from './modules/analytics';

import sendAnalyticsEventToBackend from './sendAnalyticsEventToBackend';
import FetchData from './components/FetchData';
import Issue from './components/Issue';

const Button = withCreateAnalyticsEvent({ onClick: 'click' })(
  ({ createAnalyticsEvent, ...props }) => <button {...props} />,
);

const sendAnalyticsEventToGrowth = (event, channel) =>
  // eslint-disable-next-line no-console
  console.log(`Snooped on event on ${channel || 'null'} channel:`, event);

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
            {/* <AnalyticsContext data={{ source: 'backlog', namespace: 'jira' }}>
              <div style={{ padding: '40px' }}>
                <Issue issueId={123} />
                <FetchData />
              </div>
            </AnalyticsContext> */}
            <Button
              onClick={(e, analyticsEvent) => analyticsEvent.fire('atlaskit')}
            >
              Click me
            </Button>
          </AnalyticsListener>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}
