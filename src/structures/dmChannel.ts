import { BaseClient } from "../client";
import { DMMessageManager } from "../manager";
import { BaseChannel } from "./abstract/baseChannel";
import { ChannelType, Snowflake } from "@tellme/shared-types";
import { Message } from "./message";

export class DMChannel extends BaseChannel {
    protected _type: ChannelType;
    protected _messages: DMMessageManager;
    protected _recipientId!: Snowflake ; // ID of the recipient in this DM channel
    protected lastMessageId: Snowflake | null = null; // Last message ID in this DM channel


    constructor(client: BaseClient, data: any) {
        super(client, data);
        this._type = ChannelType.DM;
        this._messages = new DMMessageManager(this);

        this.patch(data);
    }
    public get type(): ChannelType {
        return this._type;
    }
    public get messages() {
        return this._messages;
    }
    public get recipient(): Snowflake | null {
        return this.client.users.cache.get(this.recipientId);
    }
    public get recipientId(): Snowflake {
        return this.recipientId;
    }
    public patch(data: any) {
        super.patch(data);

        if (data.recipientId) {
            this._recipientId = data.recipientId;
            this.client.users.add(data.recipientId); // Todo todo1
        }

        if (data.last_message_id) {
            this.lastMessageId = data.last_message_id;
        }
    }
    
    public getLastMessage() {
        return this.lastMessageId ? this.messages.cache.get(this.lastMessageId) : null;
    }

    public send(content: Message | string) {  
        // TODO: Implement send method to send a message in this DM channel
    }
    toString() {
        //  <@123456789012345678> todo
        // return userMention(this.recipientId);
        return `<@${this.id}>`;
    }

}