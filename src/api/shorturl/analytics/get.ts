import express, { RequestHandler } from 'express';

import { UrlService } from '../../../services/urlService';

const router = express.Router();
const urlService = new UrlService();

const handler: RequestHandler = async (req, res, next) => {
  const urlsData = await urlService.getAllPublic();

  res.json(urlsData);
};

router.get('/', handler);

export const expressRouter = router;
/* For unit tests */
export const getAllHandler = handler;
