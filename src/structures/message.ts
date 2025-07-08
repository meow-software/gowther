import { BaseClient, BaseData, DataType, GowtherError, GowtherErrorCodes, Snowflake } from "..";

export class Message extends BaseData<BaseClient> implements DataType { 
    protected _channel: Snowflake;
    // TODO: other properties from backend 
    // such as guildId, createdTimestamp etc.
    constructor(client: BaseClient, data: any) {
        super(client);
        this._id = data.id; 
        this.patch(data);
    }
    get channel() {
        return this._channel;
    }

    patch(data: any) {
        this._id = data.id;
        // update other properties here

        // Not Update guildId here
    }

    async delete() {
        if (!this.channel) throw new GowtherError(GowtherErrorCodes.ChannelNotCached); 
        await this.channel.messages.delete(this.id);
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
