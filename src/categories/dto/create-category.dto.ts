import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Eletrônicos', description: 'Nome da categoria' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'eletronicos', description: 'Slug da categoria' })
  @IsNotEmpty()
  @IsString()
  slug: string;
}