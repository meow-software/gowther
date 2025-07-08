import { BaseClient } from "../../client";
import { Guild } from "../guild";
import { BaseChannel } from "./baseChannel";

export class BaseGuildChannel extends BaseChannel {
    protected _name: string;
    protected rawPosition: number;
    protected parentId: string | null;
    protected _guildId: string;

    // Todo: Implement guild channel specific properties and methods
    // permissions etc.
    constructor(client: BaseClient, data: any) {
        super(client, data);

        this.patch(data);
    }

    patch(data: any): void {
        super.patch(data);
        this._name = data.name;
        if (data.position) this.rawPosition = data.position;
        if (data.parentId) this.parentId = data.parentId;
    }

    get name(): string {
        return this._name;
    }
    get position(): number {
        return this.rawPosition;
    }
    get guild(): Guild {
        return this.client.guilds.resolve(this._guildId);
    }
    get parent(): string | null {
        return this.guild.channels.resolve(this.parentId);
    }

    permissionsOf(memberOrRole, checkAdmin: boolean = true) {  // todo: memberOrRole : Member | Role
        const member = this.guild.members.resolve(memberOrRole);
        if (member) return this.memberPermissions(member, checkAdmin);
        const role = this.guild.roles.resolve(memberOrRole);
        return role && this.rolePermissions(role, checkAdmin);
    }
    memberPermissions(member, checkAdmin: boolean = true) { 
        // Todo : Implement member permissions logic
    }

    rolePermissions(role, checkAdmin: boolean = true) {
        // Todo : Implement role permissions logic
    }

    get viewable(): boolean {
        // Is the owner: Owner of the guild can always view channels
        if (this.client.user.id === this.guild.ownerId) return true;
        // Check if the client has permission to view the channel
        const permissions = this.permissionsOf(this.client.user);
        if (!permissions) return false;
        return permissions.has(Permission.ViewChannel, false); // Todo permissions.has and .ViewChannel
    }
}