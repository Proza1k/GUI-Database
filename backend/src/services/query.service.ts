import { getManager } from 'typeorm';

export class QueryService {
  async query(str: string) {
    try {
      return getManager().query(str);
    } catch (err) {
      return {
        message: `Message error ${err}`,
      };
    }
  }
}
