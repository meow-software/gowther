import { GowtherError, GowtherErrorCodes } from "../errors";
import { IWsGateway } from "../interfaces";
import { IOptionWsGateway } from "../utils/types";
import { BaseClient } from "./base-client";
import WebSocket from 'ws';

/**
 * Represents a WebSocket gateway used to communicate with a real-time backend.
 * Handles connection, reconnection, and event transmission.
 */
export class WsGateway implements IWsGateway {
    /** The active WebSocket instance, or null if disconnected */
    private ws: WebSocket | null = null;

    /** Connection options including URL, reconnection behavior, etc. */
    private readonly options: IOptionWsGateway;

    /** Maximum number of reconnection attempts after disconnection */
    private readonly reconnectAttempts: number;

    /** Delay (in milliseconds) between reconnection attempts */
    private readonly reconnectDelay: number;

    /** Internal counter to track how many reconnection attempts have been made */
    private attemptCount: number = 0;

    /** Reference to the client instance for emitting application events */
    private client: BaseClient;

    /**
     * Creates a new instance of the WebSocket gateway.
     *
     * @param options - Configuration for the WebSocket connection.
     * @param client - The client instance used to emit events to the application.
     */
    constructor(options: IOptionWsGateway, client: BaseClient) {
        this.options = options;
        this.reconnectAttempts = options.reconnectAttempts || 5;
        this.reconnectDelay = options.reconnectDelay || 1000;
        this.client = client;
    }

    /**
     * Connects to the WebSocket server and sets up event listeners.
     * Automatically handles reconnection on disconnection.
     */
    public connect(): void {
        if (this.ws) {
            this.ws.close(); // Close any existing connection first.
        }

        this.ws = new WebSocket(this.options.url);

        this.ws.on('open', () => {
            this.client.emitEvent('connected');
            this.attemptCount = 0; // Reset reconnection counter
        });

        this.ws.on('message', (data: string) => {
            const parsedData = JSON.parse(data);
            this.client.emitEvent(parsedData.event, parsedData.data);
        });

        this.ws.on('close', () => {
            this.client.emitEvent('disconnected');
            this.handleReconnection();
        });

        this.ws.on('error', (error: Error) => {
            this.client.emitEvent('error', error);
        });
    }

    /**
     * Attempts to reconnect after disconnection, respecting the max attempts and delay.
     * Emits an error if the maximum number of attempts is exceeded.
     */
    protected handleReconnection(): void {
        if (this.attemptCount < this.reconnectAttempts) {
            setTimeout(() => {
                this.attemptCount++;
                this.connect();
            }, this.reconnectDelay);
        } else {
            this.client.emitEvent('error', new GowtherError(GowtherErrorCodes.MaxReconnectAttempts));
        }
    }

    /**
     * Returns whether the WebSocket connection is currently open.
     */
    public isConnected(): boolean {
        return !!this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Sends an event and data payload through the WebSocket connection.
     *
     * @param event - The name of the event to send.
     * @param data - The data to send with the event.
     */
    public send(event: string, data: any): void {
        if (!this.isConnected() || !this.ws) return this.client.emitEvent('error', new Error('WebSocket is not open'));
        try {
            const message = JSON.stringify({ event, data });
            this.ws.send(message);
        } catch (error) {
            this.client.emitEvent('error', new  GowtherError(GowtherErrorCodes.FailedToSerialize));
        }
    }

    /**
     * Closes the WebSocket connection if it's currently open.
     */
    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
