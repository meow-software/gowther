import { BaseClient } from "../client";
import { ClientUser } from "../structures";

export default (client: BaseClient, packet) => {
    client.actions.handle("Ready", packet.data);
    const data = packet.data;
    if (client.user) client.user.patch(packet.data.user);
    else {
        client.user = new ClientUser(client, data.user);
    }
};