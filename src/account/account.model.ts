import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'app', name: 'accounts' })
export class AccountModel {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: false })
  updatedAt: Date;

  @Column({ type: 'citext', nullable: false })
  email: string;
}
