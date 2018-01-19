// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';
import Button from '../modules/button';

class UserSelect extends Component {
  handleClick = (selectedUser, analyticsEvent) => {
    if (selectedUser !== this.props.selectedUser) {
      this.props.onSelected(selectedUser);
      this.props.raiseAnalyticsEvent(
        analyticsEvent
          .rename('select')
          .enhance(payload => ({ ...payload, value: selectedUser }))
      );
    }
  };

  render() {
    const { selectedUser } = this.props;
    const USERS = ['Jed', 'Michael', 'Jared'];

    return (
      <div>
        <p>Selected user: {selectedUser || 'none'}</p>
        <div>
          {USERS.map(name => (
            <Button
              analytics={{
                click: ({ raise }, event) => { }
              }}
              analyticsNamespace="button"
              key={name}
              onClick={
                (event, analyticsEvent) =>
                  this.handleClick(name, analyticsEvent)
              }
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}

export default withAnalytics(UserSelect);
