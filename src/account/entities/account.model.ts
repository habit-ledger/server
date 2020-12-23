import * as bcrypt from 'bcrypt';
import * as constants from '../account.constants';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'app', name: 'accounts' })
export class AccountModel {

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'boolean', nullable: false })
  public active: boolean;

  @Column({ type: 'timestamptz', nullable: false, name: 'created_at' })
  public createdAt: Date;

  @Column({ type: 'timestamptz', nullable: false, name: 'updated_at' })
  public updatedAt: Date;

  @Column({ type: 'citext', nullable: false })
  public email: string;

  @Column({ type: 'varchar', nullable: false })
  public password: string;

  public comparePassword(pwd: string): Promise<boolean> {
    return new Promise((res, rej) => {
      bcrypt.compare(pwd, this.password, (err, same) => !!err ? rej(err) : res(same));
    });
  }

  // hashPassword takes the current password, hashes it, and then re-assigns the password
  // property to the hash.
  // This should only be used if the password is still plaintext
  public hashPassword(): Promise<void> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(this.password, constants.hashRounds, (err, hash) => {
        if (!!err) return reject(err);

        this.password = hash;;
        resolve();
      });
    });
  }

}
