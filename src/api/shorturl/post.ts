import express, { RequestHandler } from 'express';
import { nanoid } from 'nanoid';

import { joiMiddleware } from '../../middlewares/joi';
import { UrlService } from '../../services/urlService';
import { addShortUrlSchema } from '../../schemas/addShortUrl.schema';
import { PublicType } from '../../models/ShortUrl';

const router = express.Router();
const urlService = new UrlService();

const validation = joiMiddleware(addShortUrlSchema);

const handler: RequestHandler = async (req, res, next) => {
  const originalUrl = req.body.url;
  const shortUrl = nanoid(6);

  await urlService.insert({
    publicType: PublicType.PUBLIC,
    sk: `${Date.now().toString()}#${shortUrl}`,
    originalUrl,
    shortUrl,
    nbClicks: 0
  }); // should check first if shortUrl isn't already taken (not uuid.v4 so it can be already in DB)

  res.json({ added: true, shortUrl });
};

router.post('/', validation, handler);

export const expressRouter = router;
/* For unit tests */
export const PostUrlHandler = handler;
export const joiValidation = validation;
