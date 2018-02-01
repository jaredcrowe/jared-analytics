// @flow

import { UIAnalyticsEvent } from './modules/analytics';

const mergeContext = context => {
  return context.reduce((merged, layer) => {
    return { ...merged, ...layer };
  }, {});
};

export default (event: UIAnalyticsEvent) => {
  // Event was created with UI context
  if (event.context) {
    const context = mergeContext(event.context);
    const { source, namespace: actionSubject, ...contextAttributes } = context;

    const attributes = { ...contextAttributes, ...event.payload };

    const toClient = {
      action: event.action,
      actionSubject,
      attributes,
      source,
    };
    console.log('RECEIVED UI EVENT:', event, 'SENDING TO CLIENT:', toClient);
    return;
  }

  // Event was created outside the UI
  const toClient = {
    action: event.action,
    attributes: event.payload,
  };
  console.log('RECEIVED GENERIC EVENT:', event, 'SENDING TO CLIENT:', toClient);
};
