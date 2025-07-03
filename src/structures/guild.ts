import { BaseGuild } from ".";
import { BaseClient } from "../client";

export class Guild extends BaseGuild {
    // Todo Manager
    protected _channels;
    // protected _members;
    // protected _roles;
    protected _shardId: number;

    constructor(client: BaseClient, data: any) {
        super(client, data)
        // TODO Manager
        // this._channels = new GuildChannelManager(this);
        // this._members = new GuildMemberManager(this);
        // this._roles = new new RoleManager(this);
        this._shardId = data.shardId;

        this.patch(data);
    }
    public get channels() {
        return this._channels;
    }
    
    patch(data: any) {
        super.patch(data);
        if (data.id) this.id = data.id;
        if (data.name) this.name = data.name;
        if (data.icon) this.icon = data.icon;
        if (data.memberCount) this.memberCount = data.memberCount;

        // If new channels data
        if (data.channels) {
            this.channels.cache.clear();
            for (const rawChannel of data.channels) {
                this.client.channels.add(rawChannel);
            }
        }

        // TODO : update other managers, roles, members etc. 
    }
}