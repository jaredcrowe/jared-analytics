// @flow

import { Children, Component, type Node } from 'react';
import PropTypes from 'prop-types';

import type { ObjectType } from './types';

const ContextTypes = {
  getAnalyticsContext: PropTypes.func,
};

type Props = {
  data: ObjectType,
  children: Node,
};

export default class AnalyticsContext extends Component<Props> {
  static contextTypes = ContextTypes;

  static childContextTypes = ContextTypes;

  getChildContext = () => ({
    getAnalyticsContext: this.getAnalyticsContext,
  });

  getAnalyticsContext = () => {
    const { data } = this.props;
    const ancestorData =
      (typeof this.context.getAnalyticsContext === 'function' &&
        this.context.getAnalyticsContext()) ||
      [];
    return [...ancestorData, data];
  };

  render() {
    return Children.only(this.props.children);
  }
}
