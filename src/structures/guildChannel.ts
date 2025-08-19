import { BaseClient } from "../client";
import { Guild } from "./guild";
import { BaseChannel } from "./abstract/baseChannel";
import { Snowflake } from "@tellme/shared-types";
import { GowtherError, GowtherErrorCodes } from "../errors";

export class GuildChannel extends BaseChannel {
    protected _name: Snowflake;
    protected _rawPosition: number;
    protected _parentId: Snowflake | null;
    protected _guildId: Snowflake;
    protected _guild: Guild | undefined;

    // Todo: Implement guild channel specific properties and methods
    // permissions etc.
    constructor(client: BaseClient, data: any, guild?: Guild) {
        super(client, data);
        this._name = data.name;
        this._rawPosition = data.position;
        this._parentId = data.parentId || null;
        this._guild = guild;
        this._guildId = guild ? guild.id : data.guildId;
        this.patch(data);
    }

    patch(data: any): void {
        super.patch(data);
        this._name = data.name;
        if (data.position) this._rawPosition = data.position;
        if (data.parentId) this._parentId = data.parentId;
    }

    get name(): string {
        return this._name;
    }
    get position(): number {
        return this._rawPosition;
    }
    get guild(): Guild {
        let guild : Guild | undefined | null = this._guild;
        if (!guild) guild = this.client.guilds.resolve(this._guildId);
        if (!guild) {
            throw new GowtherError(GowtherErrorCodes.InvalidType, "Guild is unexpectedly null.");
        }
        return guild;
    }
    get parent(): GuildChannel | null {
        return this.guild.channels.resolve(this.parentId);
    }
    get parentId(): Snowflake | null {
        return this._parentId;
    }
    get rawPosition(): number {
        return this._rawPosition;
    }

    permissionsOf(memberOrRole, checkAdmin: boolean = true) {  // todo: memberOrRole : Member | Role
        const guild = this.guild;
        // const member = guild.members.resolve(memberOrRole); // todo todo1
        const member = false;
        if (member) return this.memberPermissions(member, checkAdmin);
        // const role = guild.roles.resolve(memberOrRole);
        const role = false
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
        const guild = this.guild;
        if (this.client.user.id === guild.ownerId) return true;
        // Check if the client has permission to view the channel
        const permissions = this.permissionsOf(this.client.user);
        if (!permissions) return false;
        // return permissions.has(Permission.ViewChannel, false); // Todo permissions.has and .ViewChannel
        return false;
    }
}