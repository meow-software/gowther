import { GowtherErrorCodes, Messages } from "./error.type";


/**
 * Custom error class to handle Gowhter errors.
 * 
 * @extends Error
 */
export class GowtherError extends Error {
    constructor(errorCode: GowtherErrorCodes, details: string = '') {
        super(Messages[errorCode] + details);
    }
}