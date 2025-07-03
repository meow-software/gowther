import { Snowflake } from "..";
import { CachedManager, DataType } from "./cachedManager";

class BaseChannel implements DataType {
    public id: Snowflake; 
    constructor(id: Snowflake) {
        this.id = id;
    }
}

export class ChannelManager extends CachedManager<BaseChannel> {
    constructor(client, iterable?: Iterable<BaseChannel>) {
        super(client, BaseChannel,  iterable); 
    }
}