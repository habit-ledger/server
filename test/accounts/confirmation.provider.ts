import * as bcrypt from 'bcrypt';
import * as AccountConstants from '@app/account/account.constants';

import { DatabaseProvider, ProvideModels } from "@e2e/database/provider";
import { Repository } from "typeorm";
import { ConfirmationModel } from "@app/account/entities/confirmation.model";

export interface ICreateConfirmation {
  userId: string;
  confirmedAt?: Date;
}

@ProvideModels(ConfirmationModel)
export class ConfirmationProvider extends DatabaseProvider<ConfirmationModel> {
  public get repo(): Repository<ConfirmationModel> {
    return this.db.repo(ConfirmationModel);
  }

  public createOne(dto: ICreateConfirmation): Promise<ConfirmationModel> {
    const mod = this.repo.create(dto);
    return this.repo.save(mod);
  }

  public createMany(dtos: ICreateConfirmation[]): Promise<ConfirmationModel[]> {
    const confirmations: ConfirmationModel[] = dtos.map(a => this.repo.create(a));
    return this.repo.save(confirmations);
  }

  private hashPassword(arg: string): Promise<string> {
    return new Promise((res, rej) => {
      bcrypt.hash(arg, AccountConstants.hashRounds, (err, enc) => !!err ? rej(err) : res(enc));
    });
  }
}
