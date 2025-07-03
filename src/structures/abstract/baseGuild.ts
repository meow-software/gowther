import { BaseClient, BaseData } from "../..";


abstract class BaseGuild extends BaseData<BaseClient> {
    protected _icon: string | null;
    protected _name: string;
    constructor(client: BaseClient, data: any) {
        super(client);
        this._id = data.id;
        this._icon = data.icon;
        this._name = data._name;
    }
    get icon() {
        return this.icon;
    }
    get name() {
        return this._name;
    }
    
    toString() {
        return this.name;
    }
}