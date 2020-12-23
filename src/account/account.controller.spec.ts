import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { SpyObject, createSpyObject } from '@app/testing/spy-object';
import { TestAccount } from '@app/testing/models/account/account';
import { RegisterDTO } from './dto/register.dto';

describe('AccountController', () => {
  let controller: AccountController;

  let accountService: SpyObject<AccountService>;

  beforeEach(async () => {

    accountService = createSpyObject([ 'register', 'confirmAccount' ]);

    const module: TestingModule = await Test
      .createTestingModule({
        providers: [
          { provide: AccountService, useValue: accountService },
        ],
        controllers: [ AccountController ],
      })
      .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    let user: TestAccount;
    let body: RegisterDTO;

    beforeEach(async () => {
      user = new TestAccount().withConfirmation();
      accountService.register.mockResolvedValue(user);

      body = new RegisterDTO();
      body.email = user.email;
      body.password = user.password;

      await user.hashPassword();
    });

    it('calls register properly', async () => {
      await controller.register(body);
      expect(accountService.register).toHaveBeenCalledWith(body);
    });
  });

});
