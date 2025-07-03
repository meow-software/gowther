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
    // Check data.id in cache channels
    const existing = client.channels.cache.has(data.id);
    // Add data  in channels
    const channel = client.channels.add(data);

    // If the channel already exists, we do not emit the event again 
    if (!existing && channel) {
      // TODO : use echo event
      // client.emit(EchoEvent.ChannelCreate, channel);
      client.emit(data.event, channel);
    }
    return null;// TODO : return channel
  }
}