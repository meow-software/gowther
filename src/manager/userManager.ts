import { ChannelType, Snowflake } from "@tellme/shared-types";
import { BaseClient } from "../client";
import { DMChannel, Message, MessageCreateOptions, User } from "../structures";
import { CachedManager } from "./cachedManager";
import { Routes } from "../utils";
import { GowtherError, GowtherErrorCodes } from "../errors";

export type UserResolvable = User | Snowflake;

export class UserManager extends CachedManager<User> {
    constructor(client: BaseClient, iterable?: Iterable<User>) {
        super(client, User, iterable);

    }
    dmChannel(userId: Snowflake): DMChannel | null {
        for (const channel of this.client.channels.cache.values()) {
            if (channel.type === ChannelType.DM) {
                if ((channel as DMChannel).recipientId === userId) {
                    return channel as DMChannel;
                }
            }
        }
        return null;
    }

    async createDM(user: UserResolvable, { cache = true, force = false } = {}) {
        const id = this.resolveId(user);

        if (!force) return this.dmChannel(id);

        // const data = await this.client.rest.post(Routes.dmChannels(), { body: { recipient_id: id } });
        // return this.client.channels.add(data, { cache });
        return this.dmChannel(id); // todo
    }

    async deleteDM(user) {
        const id = this.resolveId(user);
        const dmChannel = this.dmChannel(id);
        if (!dmChannel) throw new GowtherError(GowtherErrorCodes.UserNoDMChannel);
        await this.client.rest.delete(Routes.channel(dmChannel.id));
        this.client.channels.remove(dmChannel.id);
        return dmChannel;
    }

    async fetch(user: UserResolvable, { cache = true, force = false } = {}) {
        const id = this.resolveId(user);
        if (!force) {
            const existing = this.cache.get(id);
        }

        const data = await this.client.rest.get(Routes.user(id));
        return this.add(new User(this.client, data), {cache});
    }

    async send(user: UserResolvable, message: MessageCreateOptions) {
        const dmChannel = await this.createDM(user);
        if (!dmChannel) throw new GowtherError(GowtherErrorCodes.UserNoDMChannel);
        return dmChannel.send(message);
    }
}