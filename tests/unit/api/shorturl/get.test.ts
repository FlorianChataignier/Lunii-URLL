import { NextFunction, Request, Response } from 'express';

import { getByIdHandler, joiValidation } from '../../../../src/api/shorturl/get';
import { PublicType } from '../../../../src/models/ShortUrl';
import { UrlService } from '../../../../src/services/urlService';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('services/urlService');

describe('Route testing: GET /api/shorturl/:id', () => {
  it('handler should not throw and redirect to the fetched URL', async () => {
    jest
      .spyOn(UrlService.prototype, 'getById')
      .mockResolvedValue({ publicType: PublicType.PUBLIC, sk: '', originalUrl: 'https://lunii.com', shortUrl: 'oKujI6', nbClicks: 2 });
    jest.spyOn(UrlService.prototype, 'incrementViews').mockResolvedValue();
    const redirectFunction = jest.fn();

    const req = { params: { id: 'oKujI6' } } as unknown as Request;
    const res = { redirect: redirectFunction } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await expect(getByIdHandler(req, res, next)).resolves.not.toThrow();
    expect(redirectFunction).toHaveBeenCalledTimes(1);
    expect(redirectFunction).toHaveBeenCalledWith('https://lunii.com');
  });

  it('handler should redirect to 404 if the queried shortURL does not exist', async () => {
    jest.spyOn(UrlService.prototype, 'getById').mockResolvedValue(undefined);
    jest.spyOn(UrlService.prototype, 'incrementViews').mockResolvedValue();
    const redirectFunction = jest.fn();

    const req = { params: { id: 'abcdef' } } as unknown as Request;
    const res = { redirect: redirectFunction } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await expect(getByIdHandler(req, res, next)).resolves.not.toThrow();
    expect(redirectFunction).toHaveBeenCalledTimes(1);
    expect(redirectFunction).toHaveBeenCalledWith('/404');
  });

  it('handler should throw if urlService.getById throws', async () => {
    jest.spyOn(UrlService.prototype, 'getById').mockRejectedValue(new Error('An error occured!'));
    jest.spyOn(UrlService.prototype, 'incrementViews').mockResolvedValue();
    const redirectFunction = jest.fn();

    const req = { params: { id: 'abcdef' } } as unknown as Request;
    const res = { redirect: redirectFunction } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await expect(getByIdHandler(req, res, next)).rejects.toThrowError('An error occured!');
  });

  it('Joi should allow this request', async () => {
    const req = { params: { id: 'oKujI6' } } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;

    joiValidation(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('Joi should reject this request if the input id is too long (more than 6 characters)', async () => {
    const jsonFunction = jest.fn();

    const req = { params: { id: 'abcdefghijklmn' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jsonFunction } as unknown as Response;
    const next = jest.fn() as NextFunction;

    joiValidation(req, res, next);
    expect(next).toHaveBeenCalledTimes(0);
    expect(jsonFunction).toHaveBeenCalledTimes(1);
    expect(jsonFunction).toHaveBeenCalledWith(expect.objectContaining({ error: '"id" length must be 6 characters long' }));
  });
});
