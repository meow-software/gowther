import { CachedManager, DataType } from "./cachedManager";
import { Message } from "../structures";

export class MessageManager extends CachedManager<Message> {
    constructor(client, iterable?: Iterable<Message>) {
        super(client, Message, iterable);
    }
}