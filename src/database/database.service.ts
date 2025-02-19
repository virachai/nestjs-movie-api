import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config(); // โหลด Environment Variables

@Injectable()
export class DatabaseService {
  private cachedClient: MongoClient;
  private cachedDb: Db;

  private readonly dbURI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

  async connectToDatabase() {
    if (this.cachedClient && this.cachedDb) {
      return { client: this.cachedClient, db: this.cachedDb };
    }

    const client = await MongoClient.connect(this.dbURI, {
      maxIdleTimeMS: 1000 * 60 * 6,
    });

    const db = client.db('sample_guides');

    this.cachedClient = client;
    this.cachedDb = db;

    return { client, db };
  }
}
