import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly firstName!: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly lastName!: string;

  @ApiProperty({ type: String, default: 'string!12345' })
  @IsString()
  @Length(6, 20)
  @Matches(/[\d\W]/, {
    message:
      'password must contain at least one digit and/or special character',
  })
  @Matches(/[a-zA-Z]/, { message: 'password must contain at least one letter' })
  @Matches(/^\S+$/, { message: 'password must not contain spaces' })
  readonly password!: string;
}
