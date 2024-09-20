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
  const { userIds, notification, platform } = req.body;

  const server = Server.instance;
  const { socketIds, users } = userList.getSocketIdsByUserIds(userIds, platform);

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
    clients: userList.getAllUsers()
  });
});

router.get('/users/:platform', (req: Request, res: Response) => {
  const platform = req.params.platform;
  res.json({
    ok: true,
    clients: userList.getListByPlatform(platform)
  });
});

export default router;
