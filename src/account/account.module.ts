import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModel } from './account.model';

const Models = TypeOrmModule.forFeature([ AccountModel ]);

@Module({
  imports: [ Models ],
  providers: [ AccountService ],
  exports: [ Models ],
})
export class AccountModule { }
