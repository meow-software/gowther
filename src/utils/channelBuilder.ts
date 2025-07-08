import { BaseClient } from "../client";
import { BaseChannel, Guild } from "../structures";
import { ChannelType } from "./types";
// TODO: Synchronise with ChannelType in Backend

export function channelBuilder(client: BaseClient, data: any, allowUnknownGuild: boolean,  guild?: Guild) : BaseChannel{
    const resolvedGuild = guild ?? client.guilds.cache.get(data.guildId);
    let channel;

    // Guild not found
    if (!data.guildId && !resolvedGuild) {
        if (data.type === ChannelType.DM) {
            channel = new DMChannel(client, data);
        } else if (data.type === ChannelType.GroupDM) {
            // channel = new GroupDMChannel(client, data);
        }
    } else if (resolvedGuild || allowUnknownGuild) {
        // we have a guild or we can create channel without guild
        switch (data.type) {
            case ChannelType.GuildText: {
                channel = new TextChannel(resolvedGuild, data, client);
                break;
            }

            case ChannelType.GuildVoice: {
                // channel = new VoiceChannel(resolvedGuild, data, client);
                break;
            }

            case ChannelType.GuildCategory: {
                // channel = new CategoryChannel(resolvedGuild, data, client);
                break;
            }
            // Others channel type

            default:
                break;
        }
        // we have an guild and not permit to create channel without guild
        if (channel && !allowUnknownGuild) resolvedGuild.channels?.cache.set(channel.id, channel);
    }
    return channel
}