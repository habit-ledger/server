import { INestApplication, ConflictException, NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";

import { AppModule } from "@app/app.module";
import { AccountService } from '@app/account/account.service';
import { RegisterDTO } from '@app/account/dto/register.dto';

import { Database } from '@e2e/database';
import { AccountProvider } from '@e2e/accounts/account.provider';
import { ConfirmationProvider } from '@e2e/accounts/confirmation.provider';
import { EnvironmentMap } from "@app/environment-map";
import { AccountModel } from "@app/account/entities/account.model";
import { ConfirmationModel } from "@app/account/entities/confirmation.model";

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

  describe('#confirmAccount', () => {

    let user: AccountModel;
    let confirmation: ConfirmationModel;

    beforeEach(async () => {
      user = new AccountModel();
      user.email = 'confirm@example.com';
      user.password = "TestPassword";

      await user.hashPassword();

      await providers.accounts.repo
        .createQueryBuilder()
        .insert()
        .values(user)
        .returning('*')
        .execute();

      confirmation = providers.confirmations.repo.create({ userId: user.id });

      await providers.confirmations
        .repo
        .createQueryBuilder()
        .insert()
        .values(confirmation)
        .returning('*')
        .execute();
    });

    afterEach(async () => {
      await providers.accounts.delete({ email: user.email });
    });

    it('sets the confirmedAt', async () => {
      const now = Date.now();
      await service.confirmAccount(confirmation.code);
      const record = await providers.confirmations.repo.findOne({ code: confirmation.code });
      expect(record).toBeDefined();
      expect(record.confirmedAt).toBeDefined();
      expect(record.confirmedAt?.getTime()).toBeGreaterThan(now);
    });

    it('returns the right user', async () => {
      const returnedUser = await service.confirmAccount(confirmation.code);
      expect(returnedUser).toEqual(user);
    });

    it('throws a ConflictException if confirmedAt is already set', async () => {
      await providers.confirmations.repo.update({ userId: user.id }, { confirmedAt: new Date() });
      let result: Error | null = null;
      try {
        await service.confirmAccount(confirmation.code);
      } catch (err) {
        result = err;
      }

      expect(result instanceof ConflictException).toBeTruthy();
    });

    it('throws a NotFound if there is no confirmation', async () => {
      await providers.confirmations.repo.delete({ userId: user.id });
      let result: Error | null = null;
      try {
        await service.confirmAccount(confirmation.code);
      } catch (err) {
        result = err;
      }

      expect(result instanceof NotFoundException).toBeTruthy();
    });
  });

  /**
   * Test that the register method properly creates the user's account, as well as the
   * confirmation to know that the email is not just a spam account.
   *
   * As such, this also tests the `createUser` and `createConfirmation` methods
   */
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
