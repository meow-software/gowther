import { CachedManager, DataType } from "./cachedManager";
import { BaseChannel, Message, MessageResolvable } from "../structures";
import { GowtherError, GowtherErrorCodes, Routes } from "..";
import { Snowflake } from "@tellme/shared-types";

export class MessageManager extends CachedManager<Message> {

    protected channel : BaseChannel;

    constructor(channel : BaseChannel, iterable?: Iterable<Message>) {
        super(channel.client, Message, iterable);
        this.channel = channel;
    }
    
    async fetch(params?: { messageId?: Snowflake, message?: Message, cache?: boolean, force?: boolean }) {
        if (!params) return this.fetchMany();

        const { messageId, message, cache = true, force = false } = params; 
        const toResolve = message ?? messageId;
        if (!toResolve) return null; 
        
        const resolvedMessage = this.resolveId(toResolve);
        if (resolvedMessage) return this.fetchSingle({ messageId: resolvedMessage, cache, force });
        return this.fetchMany({ cache });
    }

    protected async fetchMany(params: { cache: boolean } = { cache: true } as any) {
        // TODO: Implement fetchMany logic
        console.warn("fetchMany is not implemented yet in MessageManager.");
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

    async delete(message : MessageResolvable) { 
        const resolvedMessage = this.resolveId(message);
        if (!resolvedMessage) throw new GowtherError(GowtherErrorCodes.InvalidType, "Message not found in cache or invalid ID.");
        
        await this.client.rest.delete(Routes.channelMessage(this.channel.id, resolvedMessage)); // todo check if success
        this.cache.delete(resolvedMessage);
    }
}