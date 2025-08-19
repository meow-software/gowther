import { Snowflake } from "@tellme/shared-types";
import { GowtherError, GowtherErrorCodes } from "../errors";
import { CategoryChannel, Guild, GuildChannel } from "../structures";
import { BaseDataManager } from "./cachedManager";

export class CategoryChannelChildManager extends BaseDataManager<GuildChannel> {
    protected _parent: CategoryChannel;
    constructor(parent: CategoryChannel) {
        super(parent.client, GuildChannel);
        this._parent = parent;
    }

    get channel(): CategoryChannel {
        return this._parent;
    }
    get guild(): Guild {
        return this._parent.guild;
    }
    get cache() {
        const result = new Map<Snowflake, GuildChannel>();
        for (const [id, channel] of this.guild.channels.cache) {
            if (channel.parentId === this.channel.id) result.set(id, channel);
        }
        return result;
    }

    public async create(data: any): Promise<any> {
        // Todo : convert in  Promise<GuildChannel>
        return await this.guild.channels.create({
            ...data,
            parentId: this.channel.id
        });
    }
}