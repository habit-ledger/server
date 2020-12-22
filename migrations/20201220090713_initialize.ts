import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.raw(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "citext";
  `);

  await knex.schema.createSchema('app');

  await createAccounts(knex);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP SCHEMA app CASCADE`);
}

async function createAccounts(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('app')
    .createTable('accounts', tbl => {
      tbl.uuid('id')
        .notNullable()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));

      tbl.timestamp('created_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.timestamp('updated_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.specificType('email', 'citext')
        .notNullable()
        .unique();
    });
}
