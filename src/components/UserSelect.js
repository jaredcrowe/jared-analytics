// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';
import Button from '../modules/button';

const BoundButton = withAnalytics(Button, { click: 'onClick' });

class UserSelect extends Component {
  state = {
    isCheckboxChecked: false,
  }

  handleClick = (selectedUser, analyticsEvent) => {
    if (selectedUser !== this.props.value) {
      this.props.onChange(selectedUser);

      if (analyticsEvent) {
        analyticsEvent
          .rename('select')
          .enhance(payload => ({ ...payload, value: selectedUser }))
          .raise();
      }
    }
  }

  onCheckboxChange = () => {
    const isCheckboxChecked = !this.state.isCheckboxChecked;
    this.setState({ isCheckboxChecked });

    this.props.createAnalyticsEvent(
      'checkbox-change',
      { checked: isCheckboxChecked }
    ).raise();
  }

  render() {
    const { value } = this.props;
    const USERS = ['Jed', 'Michael', 'Jared'];

    return (
      <div>
        <p>Selected user: {value || 'none'}</p>
        <div>
          {USERS.map(name => (
            <BoundButton
              analyticsNamespace="button"
              key={name}
              onClick={(event, analyticsEvent) =>
                this.handleClick(name, analyticsEvent)}
            >
              {name}
            </BoundButton>
          ))}
          <p>
            <label>
              <input
                type="checkbox"
                onChange={this.onCheckboxChange}
                checked={this.state.isCheckboxChecked}
              />
              Here is a deeply nested checkbox which will emit an event that is caught by the Issue component.
            </label>
          </p>
        </div>
      </div>
    );
  }
}

export default withAnalytics(UserSelect);
