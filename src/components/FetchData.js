// @flow

import React, { Component } from 'react';

import Button from '../modules/button';
import { AnalyticsEvent } from '../modules/analytics';

import sendAnalyticsEventToBackend from '../sendAnalyticsEventToBackend';

const textareaStyles = {
  display: 'block',
  height: '100px',
  width: '500px',
};

const fetchBacon = async () => {
  const startTime = performance.now();

  const data = (await (await fetch(
    'https://baconipsum.com/api/?type=meat-and-filler',
  )).json())[0];

  const responseTime = performance.now() - startTime;
  const analyticsEvent = new AnalyticsEvent({
    action: 'server-request',
    payload: { data, responseTime },
  });
  sendAnalyticsEventToBackend(analyticsEvent);

  return data;
};

type State = {
  data: string,
};

export default class FetchData extends Component<*, State> {
  state = {
    data: '',
  };

  fetchData = async () => {
    const data = await fetchBacon();
    this.setState({ data });
  };

  render() {
    return (
      <div style={{ marginTop: '100px' }}>
        <p>
          There is an analytics event fired to record the response time for this
          fetch request.<br />It is created and fired from within the function
          which performs the request, which is isolated from the UI.
        </p>
        <textarea
          disabled
          readOnly
          style={textareaStyles}
          value={this.state.data}
        />
        <Button
          analyticsContext={{ namespace: 'submit-button' }}
          onClick={this.fetchData}
        >
          Fetch bacon ipsum
        </Button>
      </div>
    );
  }
}
