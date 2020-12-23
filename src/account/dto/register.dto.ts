import { Exclude, Expose } from 'class-transformer';
import { IsEmail, MinLength, MaxLength } from 'class-validator';

/**
 * Register DTO takes an email address and a password, where the password is a plaintext
 * version of a password. The services are responsible for ensuring the hashing of the password
 * (see the AccountModel) is performed.
 *
 * Passwords are minimum 8 and maximum 64 because Bcrypt does have limitations. I'm not certain
 * what the limitations are of the bcrypt we use, but 64 is used for now.
 */
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
