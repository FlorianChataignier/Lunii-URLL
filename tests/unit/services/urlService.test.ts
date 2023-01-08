import { AWSError, Request, Response } from 'aws-sdk';
import { DeleteItemOutput, PutItemOutput, QueryOutput, UpdateItemOutput } from 'aws-sdk/clients/dynamodb';

import { PublicType, ShortUrl } from '../../../src/models/ShortUrl';
import { UrlService } from '../../../src/services/urlService';
import { dynamodb } from '../../../src/utils/aws';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('aws-sdk');

const urlService = new UrlService();

describe('urlService testing', () => {
  it('getAllPublic should not throw', async () => {
    jest.spyOn(dynamodb, 'query').mockReturnValue({
      promise: async () => ({
        $response: {} as Response<QueryOutput, AWSError>,
        Items: []
      })
    } as Request<QueryOutput, AWSError>);

    await expect(urlService.getAllPublic()).resolves.not.toThrow();
  });

  it('getAllPublic should return the desired URLs', async () => {
    const returnedArray: ShortUrl[] = [
      { publicType: PublicType.PUBLIC, sk: '', originalUrl: 'https://lunii.com', shortUrl: 'oKujI6', nbClicks: 2 }
    ];
    jest.spyOn(dynamodb, 'query').mockReturnValue({
      promise: async () => ({
        $response: {} as Response<QueryOutput, AWSError>,
        Items: returnedArray
      })
    } as unknown as Request<QueryOutput, AWSError>);

    await expect(urlService.getAllPublic()).resolves.toEqual(returnedArray);
  });

  it('getAllPublic should throw if dynamodb.query throws', async () => {
    jest.spyOn(dynamodb, 'query').mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('An error occured!'))
    } as unknown as Request<QueryOutput, AWSError>);

    await expect(urlService.getAllPublic()).rejects.toThrowError('An error occured');
  });

  it('getById should not throw', async () => {
    jest.spyOn(dynamodb, 'query').mockReturnValue({
      promise: async () => ({
        $response: {} as Response<QueryOutput, AWSError>,
        Items: []
      })
    } as Request<QueryOutput, AWSError>);
    await expect(urlService.getById('oKujI6')).resolves.not.toThrow();
  });

  it('getById should return the desired URL', async () => {
    const returnedArray: ShortUrl[] = [
      { publicType: PublicType.PUBLIC, sk: '', originalUrl: 'https://lunii.com', shortUrl: 'oKujI6', nbClicks: 2 }
    ];
    jest.spyOn(dynamodb, 'query').mockReturnValue({
      promise: async () => ({
        $response: {} as Response<QueryOutput, AWSError>,
        Items: returnedArray
      })
    } as unknown as Request<QueryOutput, AWSError>);

    await expect(urlService.getById('oKujI6')).resolves.toEqual(returnedArray[0]);
  });

  it('insert should not throw', async () => {
    jest.spyOn(dynamodb, 'put').mockReturnValue({
      promise: async () => ({
        $response: {} as Response<QueryOutput, AWSError>
      })
    } as Request<PutItemOutput, AWSError>);

    await expect(
      urlService.insert({ publicType: PublicType.PUBLIC, sk: '', originalUrl: 'https://google.com', shortUrl: 'JHranj', nbClicks: 2 })
    ).resolves.not.toThrow();
  });

  it('insert should throw if dynamodb.put throws', async () => {
    jest.spyOn(dynamodb, 'put').mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('An error occured!'))
    } as unknown as Request<PutItemOutput, AWSError>);

    await expect(
      urlService.insert({ publicType: PublicType.PUBLIC, sk: '', originalUrl: 'https://google.com', shortUrl: 'JHranj', nbClicks: 2 })
    ).rejects.toThrowError('An error occured!');
  });

  it('incrementViews should not throw', async () => {
    jest.spyOn(dynamodb, 'update').mockReturnValue({
      promise: async () => ({
        $response: {} as Response<QueryOutput, AWSError>
      })
    } as Request<UpdateItemOutput, AWSError>);

    await expect(urlService.incrementViews(PublicType.PUBLIC, 'oKujI6')).resolves.not.toThrow();
  });

  it('delete should not throw', async () => {
    jest.spyOn(dynamodb, 'delete').mockReturnValue({
      promise: async () => ({
        $response: {} as Response<QueryOutput, AWSError>
      })
    } as Request<DeleteItemOutput, AWSError>);

    await expect(urlService.delete(PublicType.PUBLIC, 'oKujI6')).resolves.not.toThrow();
  });
});
