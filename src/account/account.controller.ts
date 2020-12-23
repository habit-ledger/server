import { Controller, Post, Body } from '@nestjs/common';
import { MessageResponse } from '@app/shared/responses/message';
import { RegisterDTO } from './dto/register.dto';
import { AccountService } from '@app/account/account.service';
import { ConfirmAccountDTO } from './dto/confirm.dto';

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
  public async confirmAccount(
    @Body() body: ConfirmAccountDTO
  ): Promise<MessageResponse> {
    await this.accounts.confirmAccount(body.code);
    return new MessageResponse('Email confirmed');
  }
}
