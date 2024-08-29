import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { userList } from '../sockets/socket';

const router = Router();

router.post('/alert', (req: Request, res: Response) => {
  const { body } = req;

  const server = Server.instance;
  server.io.emit('alert', body);

  res.json({
    ok: true,
    body
  });
});

router.post('/notification', (req: Request, res: Response) => {
  const { userIds, notification } = req.body;

  const server = Server.instance;
  const { socketIds, users } = userList.getSocketIdsByUserIds(userIds);

  server.io.in(socketIds).emit('notifications', notification);

  res.json({
    ok: true,
    notification,
    senders: users
  });
});

router.get('/users', (req: Request, res: Response) => {
  res.json({
    ok: true,
    clients: userList.getList()
  });
});

export default router;
