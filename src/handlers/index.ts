import CHANNEL_CREATE from './channelCreate';

/**
 * Type definition for a WebSocket packet handler.
 *
 * @param client - The WebSocket client instance.
 * @param packet - The incoming packet received from the client.
 * @param args - Optional additional arguments.
 */
type WsPacketHandler = (client: any, packet: any, ...args) => void; 

/**
 * A mapping of WebSocket event names to their corresponding handler functions.
 * Each handler processes a specific type of packet received via WebSocket.
 */
export const WsPacketHandlers: {
  [event: string]: WsPacketHandler;
} = {
  CHANNEL_CREATE,
};