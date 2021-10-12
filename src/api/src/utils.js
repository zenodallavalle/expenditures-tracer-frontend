export class RejectedRequest extends Error {
  constructor(response, json) {
    super();
    this.serviceUnreachable = !Boolean(response);
    this._response = response;
    this.statusCode = response?.status;
    this.json = json;
    if (json && !json.non_field_erros) {
      this.hasFields = true;
    } else {
      this.hasFields = false;
    }
  }
}

export const tryCatchWrapper =
  (getAuthToken) =>
  (f) =>
  async ({ ...props } = {}) => {
    try {
      return await f(getAuthToken, { ...props });
    } catch (e) {
      if (e instanceof RejectedRequest) throw e;
      else {
        console.error(e);
        throw new RejectedRequest();
      }
    }
  };
