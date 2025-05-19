import { EventEmitter } from 'events'; 
import { Rest } from './rest';
import { IBaseClient, IRest, IWsGateway } from '../interfaces';
import { DefaultClientOptions, IClientOptions } from '../utils/types';
import { WsGateway } from './ws-gateway';

/**
 * Abstract base class for all clients.
 * Provides WebSocket and REST integration, shard management, and event handling.
 */
export abstract class BaseClient extends EventEmitter implements IBaseClient {
    /** REST client instance used for HTTP API interactions */
    public readonly rest: IRest;

    /** WebSocket gateway for real-time communication */
    public wsGateway: IWsGateway;

    /** Options passed during client instantiation */
    public readonly options: IClientOptions;

    /** Optional shard ID for multi-process or sharded deployments */
    protected _shardId: number | null = null; // TODO: Implement sharding, can't be null edit and set after add shardId system

    /**
     * Constructs a new BaseClient instance.
     *
     * @param options - Partial client options to override default settings
     */
    constructor(options?: Partial<IClientOptions>) {
        super();

        // Merge provided options with default options
        this.options = { ...DefaultClientOptions, ...options };

        // Initialize REST client with given options
        this.rest = new Rest(this.options.restOptions);

        // Initialize WebSocket gateway
        this.wsGateway = new WsGateway(this.options.WsGatewayOptions, this);
    }

    /**
     * Returns the shard ID for this client instance, if any.
     */
    public get shardId() {
        return this._shardId;
    }

    /**
     * Abstract method to log in using a token.
     * Implemented by concrete subclasses.
     *
     * @param token - The authentication token
     */
    public abstract login(token: string): Promise<void>;

    /**
     * Cleans up and shuts down the client.
     * Removes event listeners, clears REST state, and disconnects WebSocket.
     */
    public destroy() {
        this.removeAllListeners();
        this.rest.clear();
        this.wsGateway.disconnect();
    }

    /**
     * Sends an event and payload to the WebSocket gateway.
     * 
     * @param event - The event name
     * @param data - The payload to send
     */
    protected sendToWSGateway(event: string, data: any) {
        this.wsGateway.send(event, data);
    }

    /**
     * Public method to send data through the WebSocket.
     * 
     * @param event - The event name
     * @param data - The payload to send
     */
    public send(event: string, data: any) {
        this.sendToWSGateway(event, data);
    }

    /**
     * Converts the client state to a JSON representation.
     *
     * @param props - Optional additional properties to include in output
     * @returns A JSON-compatible object
     */
    public toJSON(props: any) {
        return { ...props };
    }

    /**
     * Emits an internal event and logs it for debugging purposes.
     * Automatically flattens arguments if they are arrays.
     * Emits the client instance as the first argument to listeners.
     *
     * @param event - The name of the event
     * @param args - Additional arguments to emit with the event
     */
    public emitEvent(event: string, ...args: any[]) {
        // console.log(`Emitting event: ${event}`, args);  

        let flatArgs = args;
        if (Array.isArray(flatArgs)) {
            // Flatten the arguments if they are nested arrays
            flatArgs = flatArgs.flat();
        }

        // console.log('Flattened arguments:', flatArgs); 

        // Emit the event with `this` as the first argument followed by the event data
        this.emit(event, this, ...flatArgs);
    }
}
