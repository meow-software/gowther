import { BaseClient } from "../../client";
import { GuildMessageManager } from "../../manager";
import { GuildChannel } from "../guildChannel";
import { ChannelType, Snowflake } from "@tellme/shared-types";

export abstract class BaseGuildTextChannel extends GuildChannel {
    protected _type: ChannelType;
    protected _messages: GuildMessageManager;
    protected _nsfw = false; // Indicates if the channel is marked as NSFW
    protected _topic: string="";
    protected _lastMessageId: Snowflake | null = null; // Last message ID in this channel

    constructor(client: BaseClient, data: any) {
        super(client, data);
        this._type = ChannelType.GuildText;
        this._messages = new GuildMessageManager(this);
        this.patch(data);
    }

    public patch(data: any) {
        super.patch(data);

        if ('last_message_id' in data) {
            this._lastMessageId = data.last_message_id;
        }

        if ('nsfw' in data) {
            this._nsfw = data.nsfw;
        }
        if ('topic' in data) {
            this._topic = data.topic;
        }

        if ('messages' in data) {
            for (const message of data.messages) this.messages.add(message);
        }
    }

    public send(content: string) {  
        // TODO: Implement send method to send a message in this DM channel
    }
    toString() {
        //  <#123456789012345678>! todo
        // return channelMention(this.id);
        return `<#${this.id}>`;
    }

    public get type(): ChannelType {
        return this._type;
    }
    public get messages() {
        return this._messages;
    }
    public get lastMessage() {
        return this._lastMessageId ? this.messages.cache.get(this._lastMessageId) : null;
    }

    public get nsfw(): boolean {
        return this._nsfw;
    }
    public get topic(): string {
        return this._topic;
    }
}