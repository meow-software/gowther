import { IClientOptions } from '../utils/types';
import { BaseClient } from './base-client.abstract';

export class Client extends BaseClient {
  private readyTimestamp = null;
  private token: string | null = null;

  constructor(options?: Partial<IClientOptions>) {
    super(options);

  }
  /**
  * Logs the client in using the provided authentication token.
  * Establishes the WebSocket connection and sets up event listeners.
  *
  * @param token - The authentication token used to connect
  */
  public async login(token: string): Promise<void> {
    this.token = token;
    console.log('Logging in with token:', token);

    // Start the WebSocket connection via the WsGateway
    this.wsGateway.connect();

    // Handle 'connected' event from the WebSocket gateway
    this.on('connected', () => {
      // Emit a 'ready' event once the client is successfully connected
      this.emitEvent('ready', { status: 'connected' });
    });

    // Handle incoming messages from the WebSocket server
    this.on('message', (message) => {
      console.log('Message from WebSocket:', message);
    });
  }

}