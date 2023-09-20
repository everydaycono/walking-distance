import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor() {}

  // search article
  async searchArticle(type, keyword) {
    return {
      type,
      keyword
    };
  }
}
