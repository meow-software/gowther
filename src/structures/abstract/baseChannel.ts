import { BaseClient, BaseData, ChannelType, DataType, Routes, Snowflake } from "../..";

export class BaseChannel extends BaseData<BaseClient> {
    // TODO: other properties from backend 
    // such as guildId, flags, createdTimestamp etc.
    protected guildId: Snowflake;
    protected _type : ChannelType;
    constructor(client: BaseClient, data: any,) {
        super(client);
        this.guildId = data.guildId;
        this._id = data.id;
        this._type = data.type; 
        this.patch(data);
    }

    patch(data: any) {
        this._id = data.id;
        // update other properties here
        this._type = data.type;
        // Not Update guildId here
    }

    async delete() {
        await this.client.rest.delete(Routes.channel(this.id));
        return this;
    }

    get type() {
        return this._type;
    }

    isTextBased(): boolean {
        return 'messages' in this; // Can be DM, GroupDM, GuildText, etc.
    }
    
    isDMBased() {
        return [ChannelType.DM, ChannelType.GroupDM].includes(this.type);
    }

    isSendable() {
        return 'send' in this;
    }


    toString() {
        // <#id>
        // return formatChannelMention(this.id); // TODO: implement formatChannelMention
        return this.id
    }
}
