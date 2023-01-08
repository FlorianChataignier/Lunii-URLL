import { NextFunction, Request, Response } from 'express';

import { getAllHandler } from '../../../../../src/api/shorturl/analytics/get';
import { PublicType, ShortUrl } from '../../../../../src/models/ShortUrl';
import { UrlService } from '../../../../../src/services/urlService';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('services/urlService');

describe('Route testing: GET /api/shorturl/analytics', () => {
  it('handler should not throw and return the full array of URLs', async () => {
    const savedURLs: ShortUrl[] = [
      { publicType: PublicType.PUBLIC, sk: '', originalUrl: 'https://lunii.com', shortUrl: 'oKujI6', nbClicks: 2 }
    ];

    jest.spyOn(UrlService.prototype, 'getAllPublic').mockResolvedValue(savedURLs);
    const jsonFunction = jest.fn();

    const req = {} as unknown as Request;
    const res = { json: jsonFunction } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await expect(getAllHandler(req, res, next)).resolves.not.toThrow();
    expect(jsonFunction).toHaveBeenCalledTimes(1);
    expect(jsonFunction).toHaveBeenCalledWith(savedURLs);
  });

  it('handler should throw if urlService.getAllPublic throws', async () => {
    jest.spyOn(UrlService.prototype, 'getAllPublic').mockRejectedValue(new Error('An error occured!'));

    const req = {} as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;

    await expect(getAllHandler(req, res, next)).rejects.toThrowError('An error occured!');
  });
});
