import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { PublicType, ShortUrl } from '../models/ShortUrl';
import { dynamodb } from '../utils/aws';

export class UrlService {
  private readonly tableName: string;

  constructor() {
    this.tableName = process.env.URLS_TABLE;
  }

  public async getAllPublic(): Promise<ShortUrl[] | undefined> {
    const queryParams: DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#publicType = :publicType',
      ExpressionAttributeNames: { '#publicType': 'publicType' },
      ExpressionAttributeValues: { ':publicType': PublicType.PUBLIC }
    };

    const shortUrlsData = await dynamodb.query(queryParams).promise();

    return shortUrlsData.Items as ShortUrl[] | undefined;
  }

  public async getById(id: string): Promise<ShortUrl | undefined> {
    const queryParams: DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'byUrlId',
      KeyConditionExpression: '#shortUrl = :shortUrl',
      ExpressionAttributeNames: { '#shortUrl': 'shortUrl' },
      ExpressionAttributeValues: { ':shortUrl': id }
    };

    const shortUrlData = await dynamodb.query(queryParams).promise();

    return shortUrlData.Items[0] as ShortUrl | undefined;
  }

  public async insert(shortUrlData: ShortUrl): Promise<void> {
    const putParams = {
      TableName: this.tableName,
      Item: shortUrlData
    };

    await dynamodb.put(putParams).promise();
  }

  public async incrementViews(publicType: PublicType, sk: string): Promise<void> {
    const updateParams = {
      TableName: process.env.URLS_TABLE,
      Key: {
        publicType,
        sk
      },
      UpdateExpression: 'SET nbClicks = nbClicks + :inc',
      ExpressionAttributeValues: {
        ':inc': 1
      }
    };
    await dynamodb.update(updateParams).promise();
  }

  public async delete(publicType: PublicType, sk: string): Promise<void> {
    const deleteParams = {
      TableName: this.tableName,
      Key: { publicType, sk }
    };

    await dynamodb.delete(deleteParams).promise();
  }
}
