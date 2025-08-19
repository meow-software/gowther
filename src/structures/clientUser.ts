import { User } from "./user";
export class ClientUser extends User {
    // properties : mfa_enabled, verified, flags
    public patch(data: any): void {
        super.patch(data);
        if ('token' in data) {
            this.client.setToken(data.token);    
        }
    }
}