import { Router } from "express";

const routes = new Router();

routes.post("/room/:userId", (req, res) => {
  const { io, connectedUsers } = req;

  const { userId } = req.params;

  const { message, name } = req.body;

  const ownerMessage = connectedUsers[userId];

  if (!ownerMessage) return res.status(401).json({ error: "user not online" });

  io.to(ownerMessage).emit("sending message", { message, name });

  return res.json({ ok: true });
});

export default routes;
