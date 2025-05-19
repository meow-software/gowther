export interface IWsGateway {   
    connect(): void;
    isConnected(): boolean;
    send(event: string, data: any): void ;
    disconnect(): void;
}