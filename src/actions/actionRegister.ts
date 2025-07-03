import { BaseClient } from '../client';
import { Action, IAction } from './action';
import { ChannelCreateAction } from './channelCreate';
import { MessageCreateAction } from './messageCreate';

/**
 * Responsible for registering and managing all available actions.
 * Automatically instantiates action classes and assigns them dynamically.
 */
export class ActionsRegister {
  /** The shared client instance used across all actions */
  protected client: BaseClient;

  /**
   * Creates a new ActionsRegister instance and registers initial actions.
   * @param client - The client instance to be injected into actions.
   */
  constructor(client: BaseClient) {
    this.client = client;

    // Register default actions
    this.register(ChannelCreateAction);
    this.register(MessageCreateAction);

    // TODO: Register additional actions (e.g., ChannelDeleteAction, UserJoinAction, etc.)
  }

  /**
   * Dynamically registers an action class by its name.
   * Creates an instance of the action and assigns it to the current instance.
   * Example: `this.ChannelCreateAction = new ChannelCreateAction(this.client);`
   * 
   * @param action - The action class (must extend Action).
   */
  public register(action: typeof Action) {
    this[action.name] = new action(this.client);
  }
}
