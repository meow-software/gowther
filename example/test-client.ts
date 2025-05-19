// npx ts-node test-client.ts
import { Client, DefaultWsGatewayOptions } from '@tellme/gowther';

// Handler pour le message 'serverMessage'
const handleServerMessage = (client, ctx) => {
  console.log('arg1:', ctx.text);
  console.log('arg2:', ctx.lon.lat);
};

async function main() {
  // Création du client WebSocket avec options personnalisées
  const client = new Client({
    WsGatewayOptions: {
      ...DefaultWsGatewayOptions,
      url: 'http://localhost:3004',
      reconnectAttempts: 2,
      reconnectDelay: 3000,
    },
  });

  // Événement déclenché lorsque le client est prêt
  client.on('ready', () => {
    console.log('[Client] Ready!  ');
    
    // Dès que connecté, envoie un message au serveur
    client.send('message', { text: 'Hello Server!' });
  });

  // Événement : réception d'un message
  client.on('message', (data) => {
    console.log('[Client] Message received:', data);
  });

  // Événement : déconnexion
  client.on('disconnected', () => {
    console.log('[Client] Disconnected from server.');
  });

  // Événement : erreur
  client.on('error', (error) => {
    console.error('[Client] Error:', error);
  });

  // Événement personnalisé : message du serveur
  client.on('serverMessage', handleServerMessage);

  // Démarrage de la connexion WebSocket avec un token fake
  await client.login('fake-token');
}

// Démarrage du client
main();
