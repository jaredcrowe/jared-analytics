// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';

import UserSelect from './UserSelect';

class Issue extends Component {
  render() {
    return (
      <div>
        <h3>Assignee:</h3>
        <div>
          <UserSelect
            analytics={{
              select: ({ raise }, payload) => raise('assignee-change', payload),
            }}
            analyticsNamespace="assignee-select"
          />
        </div>
        <h3>Reporter:</h3>
        <div>
          <UserSelect
            analytics={{
              select: ({ raise }, payload) => raise('reporter-change', payload),
            }}
            analyticsNamespace="reporter-select"
          />
        </div>
      </div>
    );
  }
}

export default withAnalytics(Issue);
