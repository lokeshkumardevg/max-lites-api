import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsOptional() @IsString() productName?: string;
  @IsOptional() @IsString() productImage?: string;
  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsNumber() quantity?: number;
  @IsOptional() @IsNumber() price?: number;
}

export class UpdateOrderDto {
  @IsOptional() @IsArray() @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];

  @IsOptional() @IsNumber() subtotal?: number;
  @IsOptional() @IsNumber() shipping?: number;
  @IsOptional() @IsNumber() tax?: number;
  @IsOptional() @IsNumber() totalAmount?: number;

  @IsOptional() @IsString() paymentMethod?: string;

  @IsOptional()
  shippingAddress?: {
    street?: string;
    apartment?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @IsOptional() @IsString() userLongitude?: string;
  @IsOptional() @IsString() userLatitude?: string;
}
