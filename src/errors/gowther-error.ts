import { GowtherErrorCodes } from "./error-code.type";
import { Message } from "./message.type";

/**
 * Custom error class to handle Gowhter errors.
 * 
 * @extends Error
 */
export class GowtherError extends Error {
    constructor(errorCode: GowtherErrorCodes, details: string = '') {
        super(Message[errorCode] + details);
    }
}