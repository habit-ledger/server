import { Controller, Post, Body } from '@nestjs/common';
import { MessageResponse } from '@app/shared/responses/message';
import { RegisterDTO } from './dto/register.dto';
import { AccountService } from '@app/account/account.service';
import { ConfirmAccountDTO } from './dto/confirm.dto';


/**
 * The controller in charge of all things managing the user's account, including registration
 */
@Controller('account')
export class AccountController {

  constructor(
    private readonly accounts: AccountService
  ) {}

  /**
   * Register a new account with a new email address. This throws an error if there is already 
   * an account with an email address provided, and will fail validation in the situation that
   * the user gave a broken email, or a password of insufficient length / too long.
   */
  @Post()
  public async register(
    @Body() body: RegisterDTO
  ): Promise<MessageResponse> {
    await this.accounts.register(body);
    return new MessageResponse('Automatic login is next');
  }

  /**
   * Using a code that a user received in their email inbox, this takes the code and confirms
   * their account. Confirmation only works once, and will throw a Conflict if the user has already
   * confirmed their account.
   */
  @Post('confirm')
  public async confirmAccount(
    @Body() body: ConfirmAccountDTO
  ): Promise<MessageResponse> {
    await this.accounts.confirmAccount(body.code);
    return new MessageResponse('Email confirmed');
  }
}
