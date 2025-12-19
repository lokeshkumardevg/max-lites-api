import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDetailDto {
  @IsString()
  Name: string;

  @IsString()
  SKU: string;

  @IsString()
  Description: string;

  @Type(() => Number)
  @IsNumber()
  Price: number;

  @Type(() => Number)
  @IsNumber()
  SalesPrice: number;

  @Type(() => Number)
  @IsNumber()
  Stock: number;

  @Type(() => String)
  @IsString()
  subcategoryId: string;

  @Type(() => String)
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
