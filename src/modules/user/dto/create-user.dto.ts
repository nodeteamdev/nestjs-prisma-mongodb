import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
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
}
