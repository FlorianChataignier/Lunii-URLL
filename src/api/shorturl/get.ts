import express, { RequestHandler } from 'express';

import { joiMiddleware } from '../../middlewares/joi';
import { UrlService } from '../../services/urlService';
import { getUrlSchema } from '../../schemas/getUrl.schema';
import { PublicType } from '../../models/ShortUrl';

const router = express.Router();
const urlService = new UrlService();

const validation = joiMiddleware(getUrlSchema, true);

const handler: RequestHandler = async (req, res, next) => {
  const urlId = req.params.id as string;

  const urlData = await urlService.getById(urlId);
  if (!urlData) {
    return res.redirect('/404');
  }

  await urlService.incrementViews(PublicType.PUBLIC, urlData.sk);

  res.redirect(urlData.originalUrl);
};

router.get('/:id', validation, handler);

export const expressRouter = router;
/* For unit tests */
export const getByIdHandler = handler;
export const joiValidation = validation;
