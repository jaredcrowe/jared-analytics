// @flow

import React, { Component } from 'react';

import { withAnalyticsContext, UIAnalyticsEvent } from '../modules/analytics';
import Button from '../modules/button';

type Props = {
  value: ?string,
  onChange: (user: string, analyticsEvent: UIAnalyticsEvent) => void,
};

type State = {
  isCheckboxChecked: boolean,
};

class UserSelect extends Component<Props, State> {
  static defaultProps = {
    useEventCallbackButton: false,
  };

  state = {
    isCheckboxChecked: false,
  };

  handleClick = (selectedUser: string, analyticsEvent: UIAnalyticsEvent) => {
    if (selectedUser !== this.props.value) {
      analyticsEvent.update({ value: selectedUser });
      this.props.onChange(selectedUser, analyticsEvent);
    }
  };

  render() {
    const { value } = this.props;
    const USERS = ['Jed', 'Michael', 'Jared'];

    return (
      <div>
        <p>Selected user: {value || 'none'}</p>
        <div>
          {USERS.map(name => (
            <Button
              key={name}
              onClick={(event, analyticsEvent) =>
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

export default withAnalyticsContext({ namespace: 'user-select' })(UserSelect);
