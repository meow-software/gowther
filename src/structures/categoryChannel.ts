import { ChannelType } from "@tellme/shared-types";
import { GuildChannel } from "./guildChannel";
import { BaseClient } from "../client";
import { CategoryChannelChildManager } from "../manager";

export class CategoryChannel extends GuildChannel {
    protected _type: ChannelType;
    protected _children: CategoryChannelChildManager;

    constructor(client: BaseClient, data: any) {
        super(client, data);
        this._type = ChannelType.GUILD_CATEGORY;
        this._children = new CategoryChannelChildManager(this);
        this.patch(data);
    }
    get type(): ChannelType {
        return this._type;
    }
    get children(): CategoryChannelChildManager {
        return this._children;
    }
}