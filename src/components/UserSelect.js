// @flow

import React, { Component } from 'react';

import { withAnalytics } from '../modules/analytics';
import Button, { ButtonWithCreateEventCallback } from '../modules/button';
import Checkbox from '../modules/checkbox';

type Props = {
  value: string,
  useEventCallbackButton?: boolean,
  onChange: (user: string) => void,
};

type State = {
  isCheckboxChecked: boolean,
}

class UserSelect extends Component<Props, State> {
  defaultProps = {
    useEventCallbackButton: false,
  }

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
  }

  render() {
    const { value, useEventCallbackButton } = this.props;
    const USERS = ['Jed', 'Michael', 'Jared'];

    const ButtonType = useEventCallbackButton ? ButtonWithCreateEventCallback : Button;

    return (
      <div>
        <p>Selected user: {value || 'none'}</p>
        <div>
          {USERS.map(name => (
            <ButtonType
              analyticsNamespace="button"
              bindEventsToProps={{click: 'onClick' }}
              key={name}
              onClick={(event, analyticsEvent) =>
                this.handleClick(name, analyticsEvent)}
            >
              {name}
            </ButtonType>
          ))}
          <p>
            <label>
              <Checkbox
                analytics={{ checked: 'checkbox-change' }}
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

export default withAnalytics()(UserSelect);