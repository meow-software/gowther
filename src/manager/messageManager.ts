import { CachedManager, DataType } from "./cachedManager";
import { BaseChannel, Message } from "../structures";
import { Routes, Snowflake } from "..";

export class MessageManager extends CachedManager<Message> {

    protected channel : BaseChannel;

    constructor(channel : BaseChannel, iterable?: Iterable<Message>) {
        super(channel.client, Message, iterable);
        this.channel = channel;
    }
    
    async fetch(params?: { messageId?: Snowflake, message?: Message, cache?: boolean, force?: boolean }) {
        if (!params) return this.fetchMany();
        const { messageId, message, cache = true, force = false } = params;
        let resolvedMessage;
        const toResolve = message ?? messageId;
        if (toResolve) resolvedMessage = this.resolveId(toResolve);
        if (resolvedMessage) return this.fetchSingle({ messageId: resolvedMessage, cache, force });
        return this.fetchMany({ cache });
    }

    protected async fetchMany(params: { cache: boolean } = { cache: true } as any) {
        // TODO: Implement fetchMany logic
    }

    protected async fetchSingle(params: { messageId: Snowflake, cache?: boolean, force?: boolean }) {
        const { messageId, cache = true, force = false } = params;
        if (!force) {
            const existing = this.cache.get(messageId);
            if (existing) return existing;
        }

        const data = await this.client.rest.get(Routes.channelMessage(this.channel.id, messageId));
        return this.add(new Message(this.client, data), { cache });
    }
}