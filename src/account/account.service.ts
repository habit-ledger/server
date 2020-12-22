import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AccountService {

  public confirm(): Promise<unknown> {
    throw new NotImplementedException();
  }

  public register(): Promise<unknown> {
    throw new NotImplementedException();
  }

}
