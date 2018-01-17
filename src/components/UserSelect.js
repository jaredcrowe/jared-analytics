// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';
import Button from '../modules/button';

class UserSelect extends Component {
  state = {
    selectedUser: null,
  };

  handleClick = selectedUser => {
    this.setState({ selectedUser });
  };

  render() {
    const { selectedUser } = this.state;
    const USERS = ['Jed', 'Michael', 'Jared'];

    return (
      <div>
        <p>Selected user: {selectedUser || 'none'}</p>
        <div>
          {USERS.map(name => (
            <Button
              analytics={{
                click: ({ raise }, payload) =>
                  raise('select', { ...payload, value: name }),
              }}
              analyticsNamespace="button"
              disabled={selectedUser === name}
              key={name}
              onClick={() => this.handleClick(name)}
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
