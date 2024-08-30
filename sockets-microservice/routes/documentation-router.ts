import { Router } from 'express';
import path from 'path';

export const documentationRouter = Router();

documentationRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

documentationRouter.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'about.html'));
});

documentationRouter.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'contact.html'));
});
