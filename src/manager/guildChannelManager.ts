import { Snowflake } from "@tellme/shared-types";
import { Guild, GuildChannel } from "../structures";
import { jsonRestRequest, Routes } from "../utils";
import { CachedManager } from "./cachedManager";
import { GowtherError, GowtherErrorCodes } from "../errors";

export class GuildChannelManager extends CachedManager<GuildChannel> {
    protected _guild: Guild;

    constructor(client, guild, iterable?: Iterable<GuildChannel>) {
        super(client, GuildChannel, iterable);
        this._guild = guild;
    }
    public get guild() {
        return this._guild;
    }

    async create({
        name,
        parentId
    }) {
        return await this.client.rest.post(Routes.guild(),
            jsonRestRequest({
                name,
                parentId
            },
        ));
    }

    async fetch(params: { channelId: Snowflake, cache?: boolean, force?: boolean }) {
        const { channelId, cache = true, force = false } = params;

        if (!force) {
            const existing = this.cache.get(channelId);
            if (existing) return existing;
        }
        const data = await this.client.rest.get(Routes.channel(channelId));
        return this.client.channels.add(new GuildChannel(this.client, data), { guild: this.guild, cache });
    }

    async delete(channel: GuildChannel, reason?: string) {
        const id = this.resolveId(channel);
        if (!id) throw new GowtherError(GowtherErrorCodes.InvalidType, 'channel cannot be resolved to a valid ID.');
        await this.client.rest.delete(Routes.channel(id), jsonRestRequest({ reason }));
        this.client.actions.handle("ChannelDelete", { id });
    }
}