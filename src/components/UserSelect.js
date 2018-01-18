// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';
import Button from '../modules/button';

class UserSelect extends Component {

  handleClick = selectedUser => {
    if (selectedUser !== this.props.selectedUser) {
      this.props.onSelected(selectedUser);
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
                click: ({ raise }, payload) =>
                  raise('select', { ...payload, value: name }),
              }}
              analyticsNamespace="button"
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
