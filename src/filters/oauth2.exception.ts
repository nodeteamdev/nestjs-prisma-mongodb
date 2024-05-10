export class Oauth2Exception extends Error {
  message;

  constructor(message: any) {
    super();
    this.message = message;
  }
}
