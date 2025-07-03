import { Action, IAction } from '../interfaces';
 
export class ActionsRegister {
  protected client;

  constructor(client) {
    this.client = client;
    this.register(Action);// TODO : Make action channel create
  }

  public register(action: typeof Action) {
    this[action.name] = new Action(this.client);
  }
}
