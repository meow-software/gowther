import { BaseClient } from '../client'; 
import { GowtherError, GowtherErrorCodes } from '../errors';
import { Action } from './action';
import { ChannelCreateAction } from './channelCreate';
import { MessageCreateAction } from './messageCreate';

export class ActionsRegister {
  protected client: BaseClient;
  private actions: Map<string, Action> = new Map();

  constructor(client: BaseClient) {
    this.client = client;

    // Register default actions
    this.register(ChannelCreateAction);
    this.register(MessageCreateAction);
    // this.register(ChannelDeleteAction); etc.
  }

  /**
   * Register an action class and store it in the map.
   */
  public register(action: typeof Action) {
    const instance = new action(this.client);
    this.actions.set(action.name, instance);
  }

  /**
   * Retrieve an action instance by name.
   */
  public get<T extends Action>(name: string): T | undefined {
    return this.actions.get(name) as T | undefined;
  }

  /**
   * Execute a handler by action name if it exists.
   */
  public handle(name: string, payload: any) {
    const action = this.actions.get(name);
    if (!action) {
    throw new GowtherError(GowtherErrorCodes.ActionNotRegistered, `Action '${name}' not registered.`);
    }
    return action.handle(payload);
  }
}
