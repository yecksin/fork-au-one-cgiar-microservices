import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

export default class Server {
  public app: express.Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT);
  }

  start(callback: () => void) {
    this.app.listen(this.port, callback);
  }
}
