// @flow

import { UIAnalyticsEvent } from './modules/analytics';

const mergeContext = context => {
  return context.reduce((merged, layer) => {
    return { ...merged, ...layer };
  }, {});
};

export default (event: UIAnalyticsEvent, channel?: string = 'NULL CHANNEL') => {
  if (event.context) {
    // Event was created with UI context
    const context = mergeContext(event.context);
    const { source, namespace: actionSubject, ...contextAttributes } = context;

    const actionSubjectId = event.context
      .map(i => i.namespace)
      .filter(i => i)
      .join('.');

    const attributes = {
      ...contextAttributes,
      ...event.payload,
      context: JSON.stringify(event.context),
    };

    const toClient = {
      action: event.action,
      actionSubject,
      actionSubjectId,
      attributes,
      source,
    };
    console.group(`${channel.toUpperCase()} RECEIVED UI EVENT:`);
    console.log('EVENT: ', event);
    console.log('SENT DATA:', toClient);
    console.groupEnd();
  } else {
    // Event was created outside the UI
    const toClient = {
      action: event.action,
      attributes: event.payload,
    };
    console.group('RECEIVED GENERIC EVENT:');
    console.log('EVENT:', event);
    console.log('SENT DATA:', toClient);
    console.groupEnd();
  }
};
