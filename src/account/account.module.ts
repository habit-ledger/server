import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from '$account/account.service';
import { AccountModel } from '$account/entities/account.model';
import { ConfirmationModel } from '$account/entities/confirmation.model';

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
