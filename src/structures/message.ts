import { BaseClient, BaseData, DataType, Snowflake } from "..";

export class Message extends BaseData<BaseClient>  implements DataType{ 
    protected client: BaseClient;
    // TODO: other properties from backend 
    // such as guildId, createdTimestamp etc.
    constructor(client : BaseClient , data: any) {
        super(client);
        this._id = data.id;
        this.client = client; 
        this.patch(data);
    } 

    patch(data: any) {
        this._id = data.id;
        // update other properties here

        // Not Update guildId here
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
