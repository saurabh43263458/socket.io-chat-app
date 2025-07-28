import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const port = 3001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Broadcast message to other clients
  socket.on('send-message', (msg) => {
    socket.broadcast.emit('receive-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Server is running...');
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
