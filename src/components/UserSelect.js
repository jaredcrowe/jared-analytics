// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';
import Button from '../modules/button';
import { type withAnalyticsProps } from '../modules/analytics/withAnalytics';

type Props = withAnalyticsProps & {
  value: string,
  onChange: (user: string) => void,
};

type State = {
  isCheckboxChecked: boolean,
}

class UserSelect extends Component<Props, State> {
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
            <Button
              analyticsNamespace="button"
              bindEventsToProps={{click: 'onClick' }}
              key={name}
              onClick={(event, analyticsEvent) =>
                this.handleClick(name, analyticsEvent)}
            >
              {name}
            </Button>
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
