import * as request from 'supertest';

import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "@app/app.module";
import { AccountService } from '@app/account/account.service';

describe('Account Service ()', () => {
  let app: INestApplication;
  let service: AccountService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test
      .createTestingModule({ imports: [ AppModule ] })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = app.get(AccountService);
  });

  describe('#register', () => {
    it('creates a confirmation');
    it('creates a user');
  });
});
