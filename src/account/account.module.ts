import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from '@app/account/account.service';
import { AccountModel } from '@app/account/entities/account.model';
import { ConfirmationModel } from '@app/account/entities/confirmation.model';

const Models = TypeOrmModule.forFeature([
  AccountModel,
  ConfirmationModel,
]);

@Module({
  imports: [ Models ],
  providers: [ AccountService ],
  exports: [ Models, AccountService ],
})
export class AccountModule { }
