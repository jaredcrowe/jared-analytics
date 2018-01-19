// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';
import Button from '../modules/button';

const BoundButton = withAnalytics(Button, { onClick: 'click' });

class UserSelect extends Component {
  handleClick = (selectedUser, analyticsEvent) => {
    if (selectedUser !== this.props.selectedUser) {
      this.props.onSelected(selectedUser);

      if (analyticsEvent) {
        this.props.raiseAnalyticsEvent(
          analyticsEvent
            .rename('select')
            .enhance(payload => ({ ...payload, value: selectedUser }))
        );
      }
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
            <BoundButton
              analytics={{ click: true }}
              analyticsNamespace="button"
              key={name}
              onClick={
                (event, analyticsEvent) =>
                  this.handleClick(name, analyticsEvent)
              }
            >
              {name}
            </BoundButton>
          ))}
        </div>
      </div>
    );
  }
}

export default withAnalytics(UserSelect);
