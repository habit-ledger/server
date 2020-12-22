import * as bcrypt from 'bcrypt';
import * as AccountConstants from '$account/account.constants';

import { DatabaseProvider, ProvideModels } from "@e2e/database/provider";
import { Repository } from "typeorm";
import { AccountModel } from "$account/account.model";
import { RegisterDTO } from "$account/dto/register.dto";

@ProvideModels(AccountModel)
export class AccountProvider extends DatabaseProvider<AccountModel> {
  public get repo(): Repository<any> {
    return this.db.repo(AccountModel);
  }

  public async createOne(dto: RegisterDTO): Promise<AccountModel> {
    const mod = this.repo.create(dto);
    mod.password = await this.hashPassword(dto.password);
    await this.repo.save(mod);
    return mod;
  }

  public async createMany(dtos: RegisterDTO[]): Promise<AccountModel[]> {
    const users: AccountModel[] = dtos.map(a => this.repo.create(a));
    for (const user of users) {
      user.password = await this.hashPassword(user.password);
    }

    await this.repo.save(users);

    return users;
  }

  private hashPassword(arg: string): Promise<string> {
    return new Promise((res, rej) => {
      bcrypt.hash(arg, AccountConstants.hashRounds, (err, enc) => !!err ? rej(err) : res(enc));
    });
  }
}
