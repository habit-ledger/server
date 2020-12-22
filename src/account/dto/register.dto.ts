import { Exclude, Expose } from 'class-transformer';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

@Exclude()
export class RegisterDTO {
  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @MinLength(8)
  @MaxLength(64)
  public password: string;
}
