import { Action, IAction } from './action';
import { ChannelCreateAction } from './channelCreate';
 
export class ActionsRegister {
  protected client;

  constructor(client) {
    this.client = client;
    this.register(ChannelCreateAction);
    // TODO : register other actions, channel.., message create.. etc.
  }

  public register(action: typeof Action) {
    this[action.name] = new Action(this.client);
  }
}
