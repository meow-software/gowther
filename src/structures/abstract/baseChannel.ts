import { BaseClient, BaseData, DataType, Snowflake } from "../..";

export class BaseChannel implements DataType {
    public id: Snowflake; 
    constructor(id: Snowflake) {
        this.id = id;
    }
}
