class RequestRejected extends Error {
  constructor(
    haveResponse = false,
    statusCode = null,
    json = null,
    hasFields = false
  ) {
    super();
    this.serviceUnreachable = !haveResponse;
    this.statusCode = statusCode;
    this.json = json;
    this.hasFields = hasFields;
  }
}
export default RequestRejected;
