import { v4 as uuid } from 'uuid';
import { AccountModel } from "@app/account/entities/account.model";
import { TestConfirmation } from './confirmation';

/**
 * This creates a "mock" account (without a password) that can be used for testing purposes.
 */
export class TestAccount extends AccountModel {


  constructor(email = 'test@example.com', id = uuid()) {
    super();
    this.email = email;
    this.id = id;
    this.password = 'Test password 1234';

    this.active = true;
    this.createdAt = new Date();
  }

  public withConfirmation(confirmed = false): this {
    this.confirmation = new TestConfirmation(this.id, confirmed);
    this.confirmation.user = this;
    return this;
  }
}
