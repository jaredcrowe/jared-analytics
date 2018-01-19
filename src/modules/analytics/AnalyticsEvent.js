// @flow

export default class AnalyticsEvent {
  constructor(name, payload, meta) {
    this.name = name;
    this.payload = payload;
    this.meta = meta;
  }

  rename = (name) => {
    this.name = name;
    return this;
  }

  enhance = (enhancer) => {
    if (typeof enhancer === 'function') {
      this.payload = enhancer(this.payload);
    }

    // TODO: implement a smarter merge
    if (typeof enhancer === 'object') {
      this.payload = {
        ...this.payload,
        ...enhancer,
      };
    }

    return this;
  };
}
