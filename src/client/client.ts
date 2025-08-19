import { IClientOptions } from '@tellme/shared-types';
import { BaseClient } from './baseClient.abstract';
import { ClientUser, User } from '../structures';

export class Client extends BaseClient {
  private readyTimestamp = null;
  protected token: string | null = null;
  private _user!: User; // Todo: Implement User class

  constructor(options?: Partial<IClientOptions>) {
    super(options);

  }
  get user() {
    return this._user;
  }
  setToken(token: string) {
    this.token = token;
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
    
    this._user = new ClientUser(this, {
      id: '123456789012345678',
      username: 'exampleUser',
      avatar: null,
      bot: false,
    });

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