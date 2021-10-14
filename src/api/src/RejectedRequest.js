class RejectedRequest extends Error {
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

export default RejectedRequest;
