import { BaseClient, BaseData, DataType, Routes, Snowflake } from "../..";

export class BaseChannel  extends BaseData<BaseClient>  { 
    // TODO: other properties from backend 
    // such as guildId, flags, createdTimestamp etc.
    protected guildId: Snowflake;

    constructor(client : BaseClient, data: any, ) {
        super(client);
        this.guildId = data.guildId;
        this._id = data.id;
        this.patch(data);
    }

    patch(data: any) {
        this._id = data.id;
        // update other properties here
        
        // Not Update guildId here
    }
    
    async delete(){
        await this.client.rest.delete(Routes.channel(this.id));
        return this;
    }

    toString() {
        // <#id>
        // return formatChannelMention(this.id); // TODO: implement formatChannelMention
        return this.id
    }
}
