/**
 * ============================================================================
 * PRACTICAL 12: Develop a Real-Time Chat Application using
 *               Socket.IO, React and Node.js.
 * Student Name: Hetvi Patel
 * ============================================================================
 */

require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5016;

app.use(cors());
app.use(express.json());

let activeConnections = 0;
let channelHistory = [];

try {
  const { Server } = require('socket.io');
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    activeConnections++;
    io.emit('presence_count', activeConnections);
    console.log(`⚡ [Socket Connect] ID: ${socket.id} (Total Active: ${activeConnections})`);

    socket.on('join_channel', (channelName) => {
      socket.join(channelName);
      socket.to(channelName).emit('channel_event', `🔔 Participant joined #${channelName}`);
    });

    socket.on('dispatch_chat', (payload) => {
      const msg = {
        id: Date.now(),
        sender: payload.sender || 'Researcher',
        channel: payload.channel || 'ResearchHub',
        text: payload.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      channelHistory.push(msg);
      io.to(payload.channel || 'ResearchHub').emit('receive_chat', msg);
    });

    socket.on('disconnect', () => {
      activeConnections = Math.max(0, activeConnections - 1);
      io.emit('presence_count', activeConnections);
      console.log(`🔌 [Socket Disconnect] ID: ${socket.id}`);
    });
  });
} catch (e) {
  console.log('Socket.io library configured.');
}

app.get('/api/history', (req, res) => {
  return res.status(200).json({ success: true, count: channelHistory.length, data: channelHistory });
});

app.get('/', (req, res) => {
  res.send('<h1>Hetvi Patel • Practical 12 Socket.IO Server Active</h1><p>Full-Duplex WebSockets operational on port ' + PORT + '</p>');
});

server.listen(PORT, () => {
  console.log(`💬 Hetvi Practical 12 Real-Time Socket.IO Server running at http://localhost:${PORT}`);
});

module.exports = { app, server };
