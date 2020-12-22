// Update with your config settings.
import * as dotenv from 'dotenv';

// does not matter if this breaks, because it means we're assuming we're in a prod environment
try {
  dotenv.config();
} catch {}

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 },
  migrations: { tableName: 'knex_migrations' }
};
