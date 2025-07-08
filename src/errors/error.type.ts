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

    /** Maximum number of reconnection attempts reached */
    MaxReconnectAttempts,

    /** Failed to serialize the provided data */
    FailedToSerialize,

    /** Failed to deserialize the received data */
    FailedToDeserialize,

    /** The channel is not cached */
    ChannelNotCached,
}

/**
 * Type mapping each error code to a user-friendly error message.
 */
export type ErrorMessages = {
    [key in GowtherErrorCodes]: string;
};

/**
 * Custom error class to handle Gowhter errors.
 * 
 * @extends Error
 */
export const Messages: ErrorMessages = {
    [GowtherErrorCodes.TokenInvalid]: 'An invalid token was provided.',
    [GowtherErrorCodes.RestClientNotInitialized]: 'Rest client is not initialized. Please provide options (IRestOptions).',
    [GowtherErrorCodes.HttpError]: 'HTTP error! status: ',
    [GowtherErrorCodes.MaxReconnectAttempts]: "Maximum reconnection attempts reached.",
    [GowtherErrorCodes.FailedToSerialize]: "Failed to serialize the data.",
    [GowtherErrorCodes.FailedToDeserialize]: "Failed to deserialize the data.",
    [GowtherErrorCodes.ChannelNotCached]: "The channel was not cached.",
};
