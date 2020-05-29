import express from "express";
import cors from "cors";
import io from "socket.io";
import http from "http";

import routes from "./routes";

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = io(this.server);

    this.connectedUsers = {};
    this.socket();

    this.middlewares();
    this.routes();
  }

  socket() {
    this.io.on("connection", (socket) => {
      const { user_id } = socket.handshake.query;

      console.log(`User ${user_id} is connected`);
      this.connectedUsers[user_id] = socket.id;

      socket.on("disconnect", () => {
        console.log(`user ${socket.handshake.query.user_id} are disconected.`);
        delete this.connectedUsers[user_id];
      });
    });
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;

      next();
    });
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().server;
