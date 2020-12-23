import { Controller, NotImplementedException, Post, Body } from '@nestjs/common';
import { MessageResponse } from '@app/shared/responses/message';
import { RegisterDTO } from './dto/register.dto';
import { AccountService } from '@app/account/account.service';

@Controller('account')
export class AccountController {

  constructor(
    private readonly accounts: AccountService
  ) {}

  @Post()
  public async register(
    @Body() body: RegisterDTO
  ): Promise<MessageResponse> {
    await this.accounts.register(body);
    return new MessageResponse('Automatic login is next');
  }

  @Post('confirm')
  public confirmAccount(): Promise<MessageResponse> {
    throw new NotImplementedException();
  }
}
