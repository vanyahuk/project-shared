import { ConnectionOptions } from 'typeorm';
import { entities } from '../entity';

export const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dropSchema: false,
  synchronize: true,
  logging: false,
  entities: entities
};
