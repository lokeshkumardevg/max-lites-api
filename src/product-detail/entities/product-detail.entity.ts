
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDetailDocument = ProductDetail & Document;

@Schema({ timestamps: true })
export class ProductDetail {
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true, unique: true })
  SKU: string;

  @Prop({ required: true })
  Description: string;

  @Prop({ required: true })
  Price: number;

  @Prop({ required: true })
  SalesPrice: number;

  @Prop({ required: true })
  Stock: number;

  @Prop({ type: Types.ObjectId, ref: 'Subcategory', required: true })
  subcategoryId: Types.ObjectId;

  @Prop()
  categoryId:string
    

  @Prop({ type: [String], default: [] })
  imageUrls: string[];

  @Prop({ default: 'active' })
  STATUS: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);
