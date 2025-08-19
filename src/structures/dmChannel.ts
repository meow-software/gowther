import { BaseClient } from "../client";
import { DMMessageManager } from "../manager";
import { BaseChannel } from "./abstract/baseChannel";
import { ChannelType, Snowflake } from "@tellme/shared-types";

export class DMChannel extends BaseChannel {
    protected _type: ChannelType;
    protected _messages: DMMessageManager;
    protected recipientId: Snowflake | null = null; // ID of the recipient in this DM channel
    protected lastMessageId: Snowflake | null = null; // Last message ID in this DM channel


    constructor(client: BaseClient, data: any) {
        super(client, data);
        this._type = ChannelType.DM;
        this._messages = new DMMessageManager(this);
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

    public patch(data: any) {
        super.patch(data);

        if (data.recipients) {
            const recipient = data.recipients[0];
            this.recipientId = recipient[0];
            this.client.users.add(recipient); // Todo todo1
        }

        if ('last_message_id' in data) {
            this.lastMessageId = data.last_message_id;
        }
    }
    
    public getLastMessage() {
        return this.lastMessageId ? this.messages.cache.get(this.lastMessageId) : null;
    }
    
    public send(content: string) {  
        // TODO: Implement send method to send a message in this DM channel
    }
    toString() {
        //  <@123456789012345678>!
        return userMention(this.recipientId);
    }

}