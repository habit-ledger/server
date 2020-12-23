import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from '@app/account/account.service';
import { AccountModel } from '@app/account/entities/account.model';
import { ConfirmationModel } from '@app/account/entities/confirmation.model';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test
      .createTestingModule({
        providers: [
          AccountService,
          { provide: getRepositoryToken(AccountModel), useValue: {} },
          { provide: getRepositoryToken(ConfirmationModel), useValue: {} },
        ],
      })
      .compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
