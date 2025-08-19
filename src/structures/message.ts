import { BaseClient, BaseData, BaseGuildTextChannel, DataType, DMChannel, GowtherError, GowtherErrorCodes, TextBasedChannel } from "..";
import { ChannelType, Snowflake } from "@tellme/shared-types";

export type MessageResolvable = Snowflake | Message;
export type MessageCreateOptions = String;

export class Message extends BaseData<BaseClient> implements DataType {
    protected _channelId: Snowflake;
    // TODO: other properties from backend 
    // such as guildId, createdTimestamp etc.
    constructor(client: BaseClient, data: any) {
        super(client);
        this._id = data.id;
        this._channelId = data.channelId;
        this.patch(data);
    }
    get channel() {
        return this.client.channels.cache.get(this._channelId);
    }

    patch(data: any) {
        this._id = data.id;
        // update other properties here

        // Not Update guildId here
    }

    async delete() {
        const channel = this.channel as TextBasedChannel; 
        await channel.messages.delete(this.id); 
        return this;
    }

    get editable(): boolean {
        let editable = true;
        // TODO : check author == client.user.id
        // check guild exist, channel is available, etc.
        // check if permissions allow editing
        // maybe check if the message is not older than 2 hours
        return editable
    }
}
