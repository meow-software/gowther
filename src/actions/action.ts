import { BaseClient } from '../client';

/**
 * Interface representing a generic Action.
 * All actions must implement this interface.
 */
export interface IAction {
    /** The shared client instance injected into the action */
    readonly client: BaseClient;

    /**
     * Handles the action with the given data.
     * @param data - The data to process.
     * @returns Any result after processing.
     */
    handle(data: any): any;
}

/**
 * Base class for all actions.
 * Can be extended to implement specific behaviors for different events.
 */
export class Action implements IAction {
    public readonly client: BaseClient;

    /**
     * Constructs a new Action instance.
     * @param client - The client instance used by the action.
     */
    constructor(client: BaseClient) {
        this.client = client;
    }

    /**
     * Default handler method, meant to be overridden by subclasses.
     * @param data - The data to process.
     * @returns The unmodified data (default behavior).
     */
    public handle(data: any): any {
        return data;
    }
}