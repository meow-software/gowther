import { CachedManager, DataType } from "./cachedManager";

interface BaseChannel extends DataType { 
}

export class ChannelManager extends CachedManager<BaseChannel> {

}