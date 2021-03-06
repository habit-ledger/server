import * as bcrypt from 'bcrypt';
import * as constants from '../account.constants';

import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ConfirmationModel } from './confirmation.model';

/**
 * AccountModel represents a specific user's account.
 */
@Entity({ schema: 'app', name: 'accounts' })
export class AccountModel {

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'boolean', nullable: false })
  public active: boolean;

  @OneToOne(() => ConfirmationModel, a => a.user)
  public confirmation?: ConfirmationModel;

  @Column({ type: 'timestamptz', nullable: false, name: 'created_at' })
  public createdAt: Date;

  @Column({ type: 'timestamptz', nullable: false, name: 'updated_at' })
  public updatedAt: Date;

  @Column({ type: 'citext', nullable: false })
  public email: string;

  @Column({ type: 'varchar', nullable: false })
  public password: string;

  /**
   * Take a raw plaintext password and compare it to the hashed version we have in the DB
   * Note, this only works if this has been loaded, and should not be used in registration at all
   */
  public comparePassword(pwd: string): Promise<boolean> {
    return new Promise((res, rej) => {
      bcrypt.compare(pwd, this.password, (err, same) => !!err ? rej(err) : res(same));
    });
  }

  /**
   * hashPassword takes the current password, hashes it, and then re-assigns the password
   * property to the hash.                                                               
   *
   * Use this as a part of the registration process to take a plaintext password, and turn it into
   * a hashed version that is safe for saving
   */
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
