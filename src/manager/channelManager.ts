import { BaseChannel, Snowflake } from "..";
import { CachedManager, DataType } from "./cachedManager";

export class ChannelManager extends CachedManager<BaseChannel> {
    constructor(client, iterable?: Iterable<BaseChannel>) {
        super(client, BaseChannel,  iterable); 
    }
}