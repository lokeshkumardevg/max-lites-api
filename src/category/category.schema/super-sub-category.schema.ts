import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SuperSubCategory extends Document {
  @Prop({ required: true })
  name: string;

  // categoryId type as ObjectId
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  // subCategoryId type as ObjectId
  @Prop({ type: Types.ObjectId, ref: 'Subcategory', required: true })
  subCategoryId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const SuperSubCategorySchema = SchemaFactory.createForClass(SuperSubCategory);
