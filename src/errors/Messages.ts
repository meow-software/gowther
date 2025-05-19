import { ErrorCodes, ErrorMessages } from "./ErrorCodes";

export const Message: ErrorMessages = {
    [ErrorCodes.TokenInvalid]:  'An invalid token was provided.',
    [ErrorCodes.RestClientNotInitialized]: 'Rest client is not initialized. Please provide options (IRestOptions).',
};