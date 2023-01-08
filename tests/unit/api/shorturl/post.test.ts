import { NextFunction, Request, Response } from 'express';

import { joiValidation, PostUrlHandler } from '../../../../src/api/shorturl/post';
import { UrlService } from '../../../../src/services/urlService';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('services/urlService');

describe('Route testing: POST /api/shorturl', () => {
  it('handler should not throw and add into DynamoDB', async () => {
    jest.spyOn(UrlService.prototype, 'insert').mockResolvedValue();
    const jsonFunction = jest.fn();

    const req = { body: { url: 'https://lunii.com' } } as unknown as Request;
    const res = { json: jsonFunction } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await expect(PostUrlHandler(req, res, next)).resolves.not.toThrow();
    expect(jsonFunction).toHaveBeenCalledTimes(1);
    expect(jsonFunction).toHaveBeenCalledWith({ added: true });
  });

  it('handler should throw if urlService.insert throws', async () => {
    jest.spyOn(UrlService.prototype, 'insert').mockRejectedValue(new Error('An error occured!'));

    const req = { body: { url: 'https://lunii.com' } } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;

    await expect(PostUrlHandler(req, res, next)).rejects.toThrowError('An error occured!');
  });

  it('Joi should allow this request', async () => {
    const req = { body: { url: 'https://lunii.com' } } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;

    joiValidation(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('Joi should reject this request if the url is not a URI format', async () => {
    const jsonFunction = jest.fn();

    const req = { body: { url: 'abcdefg!' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jsonFunction } as unknown as Response;
    const next = jest.fn() as NextFunction;

    joiValidation(req, res, next);
    expect(next).toHaveBeenCalledTimes(0);
    expect(jsonFunction).toHaveBeenCalledTimes(1);
    expect(jsonFunction).toHaveBeenCalledWith(expect.objectContaining({ error: '"url" must be a valid uri' }));
  });
});
