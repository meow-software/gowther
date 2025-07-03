import { BaseClient } from '../client';

export interface IAction {
    readonly client: BaseClient;
    handle(data: any): any;
}

export class Action  implements IAction {
    public readonly client : BaseClient;
    constructor(client) {
        this.client = client;
    }

    public handle(data) {
        return data;
    }
}