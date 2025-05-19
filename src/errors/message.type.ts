import { GowtherErrorCodes, ErrorMessages } from "./error-code.type";

/**
 * Object mapping each error code to its corresponding user-readable message.
 */
export const Message: ErrorMessages = {
    [GowtherErrorCodes.TokenInvalid]: 'An invalid token was provided.',
    [GowtherErrorCodes.RestClientNotInitialized]: 'Rest client is not initialized. Please provide options (IRestOptions).',
    [GowtherErrorCodes.HttpError]: 'HTTP error! status: ',
};
