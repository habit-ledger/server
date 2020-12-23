import { IsString, Length } from "class-validator";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ConfirmAccountDTO {
  @IsString()
  @Length(32)
  @Expose()
  public code: string;
}
