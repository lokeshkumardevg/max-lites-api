import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSuperSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsMongoId()
  @IsNotEmpty()
  subCategoryId: string;
}
