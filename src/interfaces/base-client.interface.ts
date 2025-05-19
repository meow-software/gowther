import { Rest } from "../client";
import { IClientOptions } from "../utils/types";
import { IWsGateway } from "./ws-gateway.interface";

export interface IBaseClient {
    rest: Rest;
    wsGateway: IWsGateway;
    options: IClientOptions;
    destroy(): void;
    toJSON(props: any): any;
    login(token: string): Promise<void>;
}