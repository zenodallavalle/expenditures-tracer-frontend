class RequestsGrouper {
  constructor({
    endpoint,
    generateEndpointForOneItem = ({ id, ...args }) => `${this.endpoint}${id}/`,
    generateFallbackendpoint = ({ id, ...args }) => `${this.endpoint}${id}/`,
    timeUntilInitialize = 20, // in ms
    customArgsToRTKArgsConverter = ({ ...args } = {}) => args,
  }) {
    if (!endpoint) throw Error('endpoint cannot be null');

    this.endpoint = endpoint;
    this.generateEndpointForOneItem = generateEndpointForOneItem.bind(this);
    this.generateFallbackendpoint = generateFallbackendpoint.bind(this);
    this.timeUntilInitialize = timeUntilInitialize;
    this.customArgsToRTKArgsConverter = customArgsToRTKArgsConverter.bind(this);

    this.timeout = null;
    this.counter = 0;
    this.promises = {};

    this.work = async () => {
      const counter = this.counter++;
      this.timeout = null;
      const { headers = {}, params = {} } = this.customArgsToRTKArgsConverter(
        this.lastCallArgs
      );

      const ids = Object.keys(this.promises[counter]).map((k) => parseInt(k));

      if (ids.length === 1 && this.generateEndpointForOneItem) {
        const resolve = this.promises[counter][ids[0]];
        if (typeof resolve === 'function')
          return resolve(
            await this.baseQuery({
              url: this.generateEndpointForOneItem({ id: ids[0] }),
              headers,
              params,
            })
          );
      }

      const qs = new URLSearchParams(params);
      ids.forEach((id) => qs.append('id', id));
      const response = await this.baseQuery({
        url: this.endpoint,
        params: qs,
        headers,
      });
      response.data?.forEach((instance) => {
        const resolve = this.promises[counter][instance.id];
        if (typeof resolve === 'function')
          resolve({ ...response, data: instance });
        delete this.promises[counter][instance.id];
      });
      const remnants = Object.keys(this.promises[counter]).map((k) =>
        parseInt(k)
      );
      remnants.forEach(async (id) => {
        const resolve = this.promises[counter][id];
        if (typeof resolve === 'function')
          resolve(
            await this.baseQuery({
              url: this.generateFallbackendpoint({ id }),
              headers,
              params,
            })
          );
      });
    };

    this.get = async (id, baseQuery, args = {}) => {
      this.baseQuery = baseQuery;
      this.lastCallArgs = { ...args };
      return new Promise((resolve, reject) => {
        if (isNaN(id)) return reject({ data: 'id must be a int value' });
        if (!this.promises[this.counter]) this.promises[this.counter] = {};
        this.promises[this.counter][id] = resolve;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.work, this.timeUntilInitialize);
      });
    };

    this.queryFn = ({ id, ...args }, api, extraOptions, baseQuery) =>
      this.get(id, baseQuery, args);
  }
}
export default RequestsGrouper;
