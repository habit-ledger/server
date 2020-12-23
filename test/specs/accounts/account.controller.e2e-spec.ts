import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";

import { AppModule } from "@app/app.module";

import { Database } from '@e2e/database';
import { AccountProvider } from '@e2e/accounts/account.provider';
import { ConfirmationProvider } from '@e2e/accounts/confirmation.provider';
import { EnvironmentMap } from "@app/environment-map";

interface ITestProviders {
  accounts: AccountProvider;
  confirmations: ConfirmationProvider;
}

describe('Account Controller (e2e)', () => {
  let app: INestApplication;

  let database: Database;
  let providers: ITestProviders;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test
      .createTestingModule({ imports: [ AppModule ] })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    database = new Database(AccountProvider, ConfirmationProvider);
    database.loadEnvPgUrl(EnvironmentMap.pgUrl);
    await database.connect('AccountService');

    providers = {
      accounts: database.getProvider(AccountProvider),
      confirmations: database.getProvider(ConfirmationProvider),
    };
  });

  afterAll(async () => {
    await database.disconnect();
    await app.close();
  });

  describe('registration', () => {
    it.todo('breaks on duplicate email');
    it.todo('breaks on short passwords (under 8 chars)');
    it.todo('breaks on invalid emails');
    it.todo('breaks on long passwords (over 64 chars)');
    it.todo('returns an auth token');
  });
});
