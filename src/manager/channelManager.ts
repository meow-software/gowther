import { BaseChannel, channelBuilder, Guild, Routes, Snowflake } from "..";
import { CachedManager, DataType } from "./cachedManager";

/**
 * Manages and caches channels.
 * 
 * This class extends `CachedManager` and handles the addition and caching
 * of `BaseChannel` instances, including logic to avoid duplications and
 * optionally handle channels from unknown guilds.
 */
export class ChannelManager extends CachedManager<BaseChannel> {
    /**
     * Creates a new instance of ChannelManager.
     * 
     * @param client - The client instance used by this manager.
     * @param iterable - Optional iterable of channels to initialize the cache with.
     */
    constructor(client, iterable?: Iterable<BaseChannel>) {
        super(client, BaseChannel, iterable);
    }

    /**
    * Adds or updates a channel in the cache.
    * 
    * If the channel already exists in the cache, it updates it and adds it to the guild's internal list.
    * If not, it creates a new channel instance (using `createChannel`) and optionally caches it.
    *
    * @param data - The channel data to be added or updated.
    * @param params - An object containing additional parameters:
    *   - `guild`: The guild to which the channel belongs.
    *   - `cache` (optional): Whether to store the channel in the cache (default: `true`).
    *   - `allowUnknownGuild` (optional): Whether to allow creating a channel without a known guild (default: `false`).
    * @returns The added or updated `BaseChannel` instance, or `null` if creation failed.
    */
    public add(
        data: BaseChannel,
        params: { guild?: Guild; cache?: boolean; allowUnknownGuild?: boolean } = {} as any
    ): BaseChannel | null {
        // { guild: Guild, cache? = true, allowUnknownGuild? = false } = {} 
        const { guild, cache = true, allowUnknownGuild = false } = params;

        // Check if the channel already exists in the cache
        const existing = this.cache.get(data.id);
        if (existing) {
            // If the channel already exists, update its data
            if (cache) existing.patch(data);

            // Add the channel to the guild's cache (if the guild exists)
            guild?.channels?.add(existing);

            // TODO: Check the channel type and add it to its parent's thread list if needed
            return existing;
        }

        // Channel not found in cache — create a new one 
        const channel = channelBuilder(this.client, data, allowUnknownGuild, guild);
        if (!channel) {
            // TODO: Replace with a proper custom gowther error (e.g., "Failed to create channel: unknown guild or invalid type")
            return null;
        }

        // Store the new channel in the cache if allowed
        if (cache && !allowUnknownGuild) this.cache.set(channel.id, channel);

        return channel;
    }

    /**
     * Removes a channel from the cache and its associations.
     *
     * @param id - The ID of the channel to remove.
     */
    public remove(id: Snowflake): void {
        const channel = this.cache.get(id);
        // TODO: guild in channel
        // channel.guild.channels.cache.delete(id);

        // Remove over association

        this.cache.delete(id);
    }
    
    public async fetch(id: Snowflake,  params: { allowUnknownGuild? : boolean, cache?:boolean, force?: boolean } = {} as any ): Promise<BaseChannel | null> {
        const { force = false, cache = true, allowUnknownGuild = false } = params;
        if (!force) {
            const existing = this.cache.get(id);
            if (existing) return existing;
        }
        const data = await this.client.rest.get(Routes.channel(id));
        return this.add(new BaseChannel(this.client, data),  { cache, allowUnknownGuild });
    }
}
