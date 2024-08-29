import Server from './classes/server';
import router from './routes/router';
import express from 'express';
import cors from 'cors';

const server = Server.instance;
const { app } = server;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

server.start(() => {
  console.log(`Server running on port http://localhost:${server.port}`);
});

app.get('/', (req, res) => {
  res.send('Works');
});

app.use('/socket', router);
