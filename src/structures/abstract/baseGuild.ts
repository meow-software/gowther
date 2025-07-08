import { BaseClient, BaseData, Snowflake } from "../..";

export abstract class BaseGuild extends BaseData<BaseClient> {
    protected _icon: string | null;
    protected _name: string;
    protected _memberCount : number;
    protected _ownerId: Snowflake;

    constructor(client: BaseClient, data: any) {
        super(client);
        this._id = data.id;
        this._icon = data.icon;
        this._name = data._name;
        this._memberCount = data._memberCount;
        this._ownerId = data._ownerId;
    }
    patch(data: any) {
        super.patch(data);
        if (data.id) this._id = data.id;
        if (data.icon) this._icon = data.icon;
        if (data.name) this._name = data.name;
        if (data.memberCount) this._memberCount = data.memberCount;
        if (data.ownerId) this._ownerId = data.ownerId;
    }
    get icon() {
        return this.icon;
    }
    get name() {
        return this._name;
    }
    protected set icon(icon : string) {
        this._icon = icon;
    }

    protected set name(name: string){
        this._name  = name;
    }
    get memberCount() : number {
        return this._memberCount;
    }

    protected set memberCount(memberCount: number){
        this._memberCount  = memberCount;
    }
    get ownerId() : Snowflake {
        return this._ownerId;
    }
    toString() {
        return this.name;
    }
}