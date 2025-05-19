export enum ErrorCodes {
    TokenInvalid,
    RestClientNotInitialized,
}

export type ErrorMessages = {
    [key in ErrorCodes]: string;
  };