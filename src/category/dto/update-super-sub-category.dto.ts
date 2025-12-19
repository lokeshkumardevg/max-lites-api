import { PartialType } from '@nestjs/mapped-types';
import { CreateSuperSubCategoryDto } from './create-super-sub-category.dto';
import { IsOptional, IsString, IsMongoId, IsBoolean } from 'class-validator';

export class UpdateSuperSubCategoryDto extends PartialType(CreateSuperSubCategoryDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsMongoId()
  subCategoryId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
