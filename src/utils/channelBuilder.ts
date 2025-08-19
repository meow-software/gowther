import { BaseClient } from "../client";
import { GowtherError, GowtherErrorCodes } from "../errors";
import { BaseChannel, DMChannel, Guild, TextChannel } from "../structures";
import { ChannelType } from "@tellme/shared-types";
// TODO: Synchronise with ChannelType in Backend his

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
                channel = new TextChannel(client, data, resolvedGuild);
                break;
            }

            case ChannelType.GuildVoice: {
                // channel = new VoiceChannel(client, data, resolvedGuild));
                break;
            }

            case ChannelType.GuildCategory: {
                // channel = new CategoryChannel(client, data, resolvedGuild));
                break;
            }
            // Others channel type

            default:
                break;
        }
        // we have an guild and not permit to create channel without guild
        if (channel && !allowUnknownGuild && !!resolvedGuild) resolvedGuild.channels?.cache.set(channel.id, channel);
        if (!guild) {
            throw new GowtherError(GowtherErrorCodes.InvalidType, "Guild is not found.");
        }
    }
    return channel
}