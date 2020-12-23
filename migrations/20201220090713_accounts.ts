import * as Knex from "knex";

async function createAccounts(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('app')
    .createTable('accounts', tbl => {
      tbl.uuid('id')
        .notNullable()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));

      tbl.boolean('active')
        .notNullable()
        .defaultTo(true);

      tbl.timestamp('created_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.timestamp('updated_at')
        .defaultTo(knex.fn.now())
        .notNullable();

      tbl.specificType('email', 'citext')
        .notNullable()
        .unique();

      tbl.specificType('password', 'char(60)');
    });
}

async function createConfirmations(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('app')
    .createTable('account_confirmations', tbl => {
      tbl.uuid('user_id')
        .primary()
        .references('id')
        .inTable('app.accounts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      tbl.timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());

      tbl.timestamp('confirmed_at')
        .nullable()
        .defaultTo(null);

      tbl.specificType('code', 'char(32)')
        .notNullable()
        .defaultTo(knex.raw('md5(uuid_generate_v4()::text)'));
    });
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "citext";
  `);

  await knex.schema.createSchema('app');

  await createAccounts(knex);
  await createConfirmations(knex);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP SCHEMA app CASCADE`);
}

