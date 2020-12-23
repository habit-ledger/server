import { v4 as uuid } from 'uuid';
import { ConfirmationModel } from "@app/account/entities/confirmation.model";

/**
 * This creates a "mock" confirmation that can be used 
 */
export class TestConfirmation extends ConfirmationModel {
  constructor(userId: string, confirmed = false) {
    super();
    this.userId = userId;
    this.code = uuid().slice(0, 32);
    this.confirmedAt = confirmed ? new Date() : null;
    this.createdAt = new Date();
  }
}
