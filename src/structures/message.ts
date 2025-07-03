import { BaseClient, BaseData, DataType, Snowflake } from "..";

export class Message extends BaseData<BaseClient>  implements DataType{
    id: Snowflake;
    protected client: BaseClient;
    constructor(client : BaseClient , id: Snowflake) {
        super(client);
        this.id = id;
        this.client = client; 
    } 
}
