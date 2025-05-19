/**
 * Enumeration of possible error codes.
 */
export enum GowtherErrorCodes {
    /** The provided token is invalid */
    TokenInvalid,
    /** REST client has not been initialized */
    RestClientNotInitialized,
    /** HTTP error occurred */
    HttpError,
}

/**
 * Type mapping each error code to a user-friendly error message.
 */
export type ErrorMessages = {
    [key in GowtherErrorCodes]: string;
};
