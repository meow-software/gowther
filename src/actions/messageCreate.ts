import { Action } from "./action";

/**
 * Handles the event when a new message is created.
 */
export class MessageCreateAction extends Action {
    /**
     * Processes the "message create" event data.
     * @param data - The payload associated with the message creation.
     * @returns Any processed result (to be implemented).
     */
    handle(data) {
        console.log("MessageCreateAction handle called with data:", data);
        const client = this.client;
        return null;
    }
}