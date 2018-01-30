// @flow

import React from 'react';
import { withAnalytics } from '../analytics';

type Props = {
  checked: boolean,
  onChange: (e: MouseEvent) => void,
};

const Input = ({ ...props }: Props ) => (<input type="checkbox" {...props} />);

export default withAnalytics({
  onChange: (createEvent, props) => createEvent('change', { checked: !props.checked }),
})(Input);