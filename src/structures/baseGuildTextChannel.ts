import { BaseClient } from "../client";
import { DMMessageManager, GuildMessageManager } from "../manager";
import { BaseChannel } from "./abstract/baseChannel";
import { ChannelType, Snowflake } from "@tellme/shared-types";

export class BaseGuildTextChannel extends BaseChannel {
    protected _type: ChannelType;
    protected _messages: GuildMessageManager;
    protected recipientId: Snowflake | null = null;
    protected _nsfw = false; // Indicates if the channel is marked as NSFW
    protected _topic: string;
    protected _lastMessageId: Snowflake | null = null; // Last message ID in this channel

    constructor(client: BaseClient, data: any) {
        super(client, data);
        this._type = ChannelType.DM;
        this._messages = new GuildMessageManager(this);
        this.patch(data);
    }

    public patch(data: any) {
        super.patch(data);

        if (data.recipients) {
            const recipient = data.recipients[0];
            this.recipientId = recipient[0];
            this.client.users.add(recipient); // Todo todo1
        }

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
        // return channelMention(this.recipientId);
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