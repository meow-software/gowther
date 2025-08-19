import { BaseClient } from "../client";
import { BaseChannel } from "./abstract/baseChannel";
import { BaseData } from "./abstract/baseData";
import { MessageCreateOptions } from "./message";
export class User extends BaseData<BaseClient> {
    protected _username: string;
    protected _avatar: string | null = null;
    protected _bot: boolean = false;
    // flags etc.
    constructor(client: BaseClient, data: any) {
        super(client);
        this._username = data.username;
        this._avatar = data.avatar;
        this.patch(data);
    }

    public patch(data: any): void {
        if (data.username) {
            this._username = data.username;
        }
        if (data.avatar) {
            this._avatar = data.avatar;
        }
    }

    async createDM(force = false) {
        return this.client.users.createDM(this.id, { force });
    }
    async deleteDM() {
        return this.client.users.deleteDM(this.id);
    }

    async send(message: MessageCreateOptions) {
        const dmChannel = await this.createDM();

        return this.client.channels.createMessage(dmChannel as BaseChannel, message);
    }

    async fetch(force = true) {
        return this.client.users.fetch(this.id, { force });
    }
    
    toJson() {
        return {
            id: this.id,
            username: this._username,
            avatar: this._avatar,
            bot: this._bot
        };
    }

    toString() {
        // return userMention(this.id); // TODO
        return `<@${this.id}>`;
    }
    get displayName() {
        return this.username;
    }
    get dmChannel() {
        return this.client.users.dmChannel(this.id);
    }
    public get username(): string {
        return this._username;
    }

    public get avatar(): string | null {
        return this._avatar;
    }

}