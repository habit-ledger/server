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

}
