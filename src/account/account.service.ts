import { Injectable, NotImplementedException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { AccountModel } from './entities/account.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmationModel } from './entities/confirmation.model';
import { Repository, QueryFailedError } from 'typeorm';

@Injectable()
export class AccountService {

  constructor(
    @InjectRepository(AccountModel)
    private accountRepo: Repository<AccountModel>,

    @InjectRepository(ConfirmationModel)
    private confirmationRepo: Repository<ConfirmationModel>
  ) { }

  public confirm(): Promise<unknown> {
    throw new NotImplementedException();
  }

  public async create(dto: RegisterDTO): Promise<AccountModel> {
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
      throw err;
    }

    const conf = this.confirmationRepo.create({ userId: user.id });
    await this.confirmationRepo.save(conf);

    return user;
  }

}
