import { IsString, IsEmail, MinLength, IsNotEmpty, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';

  @IsString()
  @IsIn(['admin', 'user'])
  role: 'admin' | 'user';
}
