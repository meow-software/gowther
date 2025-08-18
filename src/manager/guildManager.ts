import { Snowflake } from "@tellme/shared-types";
import { Guild } from "../structures";
import { jsonRestRequest, Routes } from "../utils";
import { CachedManager } from "./cachedManager";

export class GuildManager extends CachedManager<Guild> {
    constructor(client, iterable?: Iterable<Guild>) {
        super(client, Guild, iterable);
    }

    async create({
        name,
    }) {
        return await this.client.rest.post(Routes.guild(),
            jsonRestRequest({
                name,
            },
            ));
    }

    async fetch(params: { guildId?: Snowflake, guild?: Guild, cache?: boolean, force?: boolean }) {
        const { guildId, guild, cache = true, force = false } = params;

        const toResolve = guild ?? guildId;
        if (!toResolve) return null;

        const resolvedGuild = this.resolveId(toResolve);
        if (!force) {
            const existing = this.cache.get(resolvedGuild);
            if (existing) return existing;
        }
        const data = await this.client.rest.get(Routes.guild(resolvedGuild));
        return this.add(new Guild(this.client, data), { cache }); // Todo later: check guild is managed by shard and client
    }

}