import {
  Injectable,
  NotImplementedException,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { RegisterDTO } from './dto/register.dto';
import { AccountModel } from './entities/account.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmationModel } from './entities/confirmation.model';
import { Repository, QueryFailedError } from 'typeorm';

/**
 * AccountService exposes functionality for the application to interact with a user's account.
 * This includes registration, login, etc.
 */
@Injectable()
export class AccountService {

  constructor(
    @InjectRepository(AccountModel)
    private accountRepo: Repository<AccountModel>,

    @InjectRepository(ConfirmationModel)
    private confirmationRepo: Repository<ConfirmationModel>
  ) { }

  /**
   * Using just a code, find a confirmation with no confirmedAt date. Having found that record,
   * set the confirmedAt date and save it. If none is found, throw an error 404. If one is found,
   * but it is already confirmed, throw a ConflictException.
   *
   * Returns the account that is linked to the confirmation for sake of ease.
   */
  public async confirmAccount(code: string): Promise<AccountModel> {
    const confirmation = await this.confirmationRepo.findOne({ code }, { relations: [ 'user' ] });
    if (confirmation == null) {
      throw new NotFoundException('No confirmation with that code was found');
    }

    if (confirmation.confirmedAt != null) {
      throw new ConflictException('Account already confirmed');
    }

    confirmation.confirm();
    await this.confirmationRepo.save(confirmation);

    return confirmation.user;
  }

  /**
   * Using a RegisterDTO, create a new user account
   */
  public async createUser(dto: RegisterDTO): Promise<AccountModel> {
    const user = this.accountRepo.create(dto);
    try {
      await user.hashPassword();
    } catch (err) {
      console.error('Unable to hash user password\n', err);
      throw new InternalServerErrorException('Something went wrong creating the account');
    }
    try {
      await this.accountRepo.createQueryBuilder()
        .insert()
        .values(user)
        .returning('*')
        .execute();
    } catch (err) {
      if (err instanceof QueryFailedError && err.message.includes('duplicate')) {
        throw new ConflictException('Email already in use');
      }

      console.error('Unable to save user account\n', err);
      throw new InternalServerErrorException('Something went wrong creating your account');
    }

    return user;
  }

  /**
   * Using an existing UserId, create a new user confirmation. Note, this errors if the
   * confirmation already exists.
   */
  public async createConfirmation(userId: string): Promise<ConfirmationModel> {
    const conf = this.confirmationRepo.create({ userId });
    try {
      await this.confirmationRepo.createQueryBuilder()
        .insert()
        .values(conf)
        .returning('*')
        .execute();
    } catch(err) {
      if (err instanceof QueryFailedError && err.message.includes('duplicate')) {
        throw new ConflictException('User already has a confirmation');
      }

      if (err instanceof QueryFailedError) {
        const msg = 'Unable to create confirmation, please contact support';
        console.error(err);
        throw new InternalServerErrorException(msg);
      }

      console.error(err);
      throw err;
    }

    return conf;
  }

  /**
   * Create a new user account, including the user's account confirmation
   */
  public async register(dto: RegisterDTO): Promise<AccountModel> {
    const user = await this.createUser(dto);
    user.confirmation = await this.createConfirmation(user.id);

    return user;
  }

}
