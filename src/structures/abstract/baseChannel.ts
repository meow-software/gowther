import { BaseClient, BaseData, DataType, Snowflake } from "../..";

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
}
