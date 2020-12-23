import { INestApplication, ConflictException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";

import { AppModule } from "@app/app.module";
import { AccountService } from '@app/account/account.service';
import { RegisterDTO } from '@app/account/dto/register.dto';

import { Database } from '@e2e/database';
import { AccountProvider } from '@e2e/accounts/account.provider';
import { ConfirmationProvider } from '@e2e/accounts/confirmation.provider';
import { EnvironmentMap } from "@app/environment-map";

interface ITestProviders {
  accounts: AccountProvider;
  confirmations: ConfirmationProvider;
}

describe('Account Service ()', () => {
  let app: INestApplication;
  let service: AccountService;

  let database: Database;
  let providers: ITestProviders;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test
      .createTestingModule({ imports: [ AppModule ] })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = app.get(AccountService);
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


  describe('#register', () => {

    let dto: RegisterDTO;
    
    const clean = async () => {
      await providers.accounts.delete({ email: 'register_test@example.com' });
    };

    beforeEach(async () => {
      await clean();
      dto = new RegisterDTO();
      dto.email = 'register_test@example.com';
      dto.password = 'walkajslfjlkajfd';
    });

    afterEach(async () => {
      await clean();
    });

    it('creates a confirmation', async () => {
      const res = await service.register(dto);
      expect(res.id).toBeDefined();
      expect(res.confirmation).toBeDefined();

      const conf = await providers.confirmations.repo.findOne({ userId: res.id });

      expect(conf).toBeDefined();
      expect(conf).toEqual(res.confirmation);
    });

    it('creates a user', async () => {
      const res = await service.register(dto);
      expect(res).toBeDefined();

      const match = await providers
        .accounts
        .repo
        .findOne(res.id, { relations: [ 'confirmation' ] });

      expect(match).toEqual(res);
    });

    it('hashes the password', async () => {
      const res = await service.register(dto);
      expect(res.password).not.toEqual(dto.password);

      const same = await providers.accounts.comparePassword(dto.password, res.password);
      expect(same).toBeTruthy();
    });

    it('errors if email in use', async () => {
      await service.register(dto);
      try {
        await service.register(dto);
      } catch (err) {
        if (err instanceof ConflictException) return;
        console.error(err);
      }

      throw new Error('Expected ConflictException, did not get one');
    });
  });
});
