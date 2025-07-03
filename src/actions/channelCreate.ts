import { Action } from "./action";

export class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    // TODO: check data.id in cache channels

    // TODO: add data  in channels

    // TODO: If the channel already exists, we do not emit the event again 
    
    return null ;// TODO : return channel
  }
}