import { BaseClient, BaseData } from "../..";

export abstract class BaseGuild extends BaseData<BaseClient> {
    protected _icon: string | null;
    protected _name: string;
    protected _memberCount : number;

    constructor(client: BaseClient, data: any) {
        super(client);
        this._id = data.id;
        this._icon = data.icon;
        this._name = data._name;
        this._memberCount = data._memberCount;
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
    
    toString() {
        return this.name;
    }
}