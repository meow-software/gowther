import { IClientOptions } from '../utils/types';
import { BaseClient } from './base-client.abstract';

export class Client extends BaseClient {
  private readyTimestamp = null;
  private token: string | null = null;

  constructor(options?: Partial<IClientOptions>) {
    super(options);
    
  }
  
  // Connexion à l'API 
  public async login(token: string): Promise<void> {
    console.log('Logging in with token:', token);
  }
}