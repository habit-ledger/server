import { PrimaryColumn, OneToOne, Column } from "typeorm";
import { AccountModel } from "./account.model";

export class ConfirmationModel {

  @Column({ type: 'timestamptz', nullable: false, name: 'created_at' })
  public createdAt: Date;

  @Column({ type: 'timestamptz', nullable: false, name: 'confirmed_at' })
  public confirmedAt: Date;

  @Column({ type: 'char', nullable: false, length: 32 })
  public code: string;

  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  public userId: string;

  @OneToOne(() => AccountModel)
  public user: AccountModel;
}