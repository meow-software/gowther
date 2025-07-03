import { Action } from "./action";
/**
 * Handles the event when a new channel is created.
 */
export class ChannelCreateAction extends Action {
  /**
   * Processes the "channel create" event data.
   * @param data - The payload associated with the channel creation.
   * @returns Any processed result (to be implemented).
   */
  handle(data) {
    const client = this.client;
    console.log("ChannelCreateAction handle called with data:", data);
    // TODO: check data.id in cache channels

    // TODO: add data  in channels

    // TODO: If the channel already exists, we do not emit the event again 

    return null;// TODO : return channel
  }
}