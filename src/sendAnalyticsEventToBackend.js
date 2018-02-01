// @flow

import { UIAnalyticsEvent } from './modules/analytics';

const mergeContext = context => {
  return context.reduce((merged, layer) => {
    return { ...merged, ...layer };
  }, {});
};

export default (event: UIAnalyticsEvent) => {
  const context = mergeContext(event.context);
  const { source, namespace: actionSubject, ...contextAttributes } = context;

  const attributes = { ...contextAttributes, ...event.payload };

  const toClient = {
    action: event.action,
    actionSubject,
    attributes,
    source,
  };
  console.log('RECEIVED EVENT:', event, 'SENDING TO CLIENT:', toClient);
};
