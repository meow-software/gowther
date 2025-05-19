import { IClientOptions } from "../utils/types";
import { IRest } from "./rest.interface";
import { IWsGateway } from "./ws-gateway.interface";

export interface IBaseClient {
    rest: IRest;
    wsGateway: IWsGateway;
    options: IClientOptions;
    destroy(): void;
    toJSON(props: any): any;
    login(token: string): Promise<void>;
}