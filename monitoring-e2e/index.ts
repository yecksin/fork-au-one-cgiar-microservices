import Server from './classes/server';
import express from 'express';
import cors from 'cors';
import { mainCron } from './controllers/cronController';

const server = new Server();
const { app } = server;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

server.start(() => {
  console.log(`Server running on port http://localhost:${server.port}`);
});

mainCron();
