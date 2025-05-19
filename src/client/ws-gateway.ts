import { IWsGateway } from "../interfaces";
import { IOptionWsGateway } from "../utils/types";
import { BaseClient } from "./base-client";
import WebSocket from 'ws';


export class WsGateway implements IWsGateway {
    private ws: WebSocket | null = null;
    private readonly options: IOptionWsGateway;
    private readonly reconnectAttempts: number;
    private readonly reconnectDelay: number;
    private attemptCount: number = 0;
    private client: BaseClient;

    constructor(options: IOptionWsGateway, client: BaseClient) {
        this.options = options;
        this.reconnectAttempts = options.reconnectAttempts || 5;  // Valeur par défaut de 5 tentatives
        this.reconnectDelay = options.reconnectDelay || 1000;  // Valeur par défaut de 1 seconde de délai
        this.client = client;  // L'instance de client pour émettre les événements
    }

    public connect(): void {
    }

    public isConnected(): boolean {
        return !!this.ws && this.ws.readyState === WebSocket.OPEN;
    }


    public send(event: string, data: any): void {
    }

    public disconnect(): void {
    }
}
