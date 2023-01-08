export interface ShortUrl {
  publicType: PublicType;
  sk: string;

  originalUrl: string;
  shortUrl: string;
  nbClicks: number;
}

export enum PublicType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}
