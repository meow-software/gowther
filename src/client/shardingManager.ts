import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import { IShardingManager } from '../interfaces';
import { Client } from './client';
import { IShardingOptions } from '../utils/types';

interface ShardInfo {
  id: number;
  process: ChildProcess;
  client: Client;  
}

export class ShardingManager extends EventEmitter implements IShardingManager {
  private options: IShardingOptions;
  private shards: Map<number, ShardInfo>;  

  constructor(options: IShardingOptions) {
    super();
    this.options = options;
    this.shards = new Map();
  }

}
