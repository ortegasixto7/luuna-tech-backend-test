import { Db, MongoClient } from 'mongodb';
import { DATABASE_URL } from '../../config/config';

export abstract class MongoDbClient {
  private static db: Db;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async initDb(): Promise<void> {
    if (!this.db) {
      const client = new MongoClient(DATABASE_URL);
      try {
        await client.connect();
        this.db = client.db();
      } catch (error) {
        console.error(error);
        throw new Error('Cannot connect to database => ');
      }
    }
  }

  static getInstance(): Db {
    if (!this.db) throw new Error('Database instance is undefined');
    return this.db;
  }
}
