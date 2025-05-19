// node .\server.js
import { WebSocketServer } from 'ws';

// Crée un serveur WebSocket sur le port 3004
const wss = new WebSocketServer({ port: 3004 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Dès la connexion, on envoie un message de bienvenue
  ws.send(JSON.stringify({
    event: 'welcome',
    data: {
      text: 'Welcome to WebSocket server!',
    },
  }));

  // Quand on reçoit un message d'un client
  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    // Répond avec un message structuré
    ws.send(JSON.stringify({
      event: 'serverMessage',
      data: {
        text: 'Hello from server!',
        id: 1,
        lon: {
          lat: 1,
          nom: 'Paris',
        },
      },
    }));
  });

  // Quand le client se déconnecte
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('✅ WebSocket server running on ws://localhost:3004');
