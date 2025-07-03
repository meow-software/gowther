import { CachedManager, DataType } from "./cachedManager";

interface Message extends DataType { 
}

export class MessageManager extends CachedManager<Message> {

}