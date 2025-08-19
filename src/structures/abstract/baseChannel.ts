import { BaseClient, BaseData, BaseGuildTextChannel, DMChannel, Routes } from "../..";
import { ChannelType } from "@tellme/shared-types";

export type TextBasedChannel = BaseGuildTextChannel | DMChannel;

export class BaseChannel extends BaseData<BaseClient> {
    // TODO: other properties from backend 
    // such as flags, createdTimestamp etc.
    protected _type : ChannelType;
    constructor(client: BaseClient, data: any,) {
        super(client);
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
