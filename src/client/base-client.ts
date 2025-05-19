import { EventEmitter } from 'events'; 
import { Rest } from './rest';
import { IBaseClient, IWsGateway } from '../interfaces';
import { DefaultClientOptions, IClientOptions } from '../utils/types';
import { WsGateway } from './ws-gateway';

export abstract class BaseClient  extends EventEmitter implements IBaseClient {
    public readonly rest: Rest;
    public wsGateway: IWsGateway; 
    public readonly options: IClientOptions;
    protected _shardId: number | null = null; 
    
  constructor(options?: Partial<IClientOptions>) {
    super();
    this.options = {...DefaultClientOptions, ...options};
    this.rest = new Rest(this.options.restOptions);
    this.wsGateway = new WsGateway(this.options.WsGatewayOptions, this); 
  }

  public get shardId() {
    return this._shardId;
  }
  
  public abstract login(token: string): Promise<void>;


  public destroy() {
  }

  protected sendToWSGateway(event: string, data: any) {
    this.wsGateway.send(event, data); 
  }
  public send(event: string, data: any) {
    this.sendToWSGateway(event, data); 
  }
  
  public toJSON(props: any) {
    return { ...props };
  }

  public emitEvent(event: string, ...args: any[]) {
  }
}