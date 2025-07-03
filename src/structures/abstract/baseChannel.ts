import { BaseClient, BaseData, DataType, Snowflake } from "../..";

export class BaseChannel  extends BaseData<BaseClient>  implements DataType {
    protected _id: Snowflake; 
    // TODO: other properties from backend 
    // such as guildId, flags, createdTimestamp etc.
    protected guildId: Snowflake;

    constructor(client : BaseClient, data: any, ) {
        super(client);
        this.guildId = data.guildId;
        this._id = data.id;
        this.patch(data);
    }
    get id(): Snowflake {
        return this.id;
    }

    patch(data: any) {
        this._id = data.id;
        // update other properties here
        
        // Not Update guildId here
    }
}
