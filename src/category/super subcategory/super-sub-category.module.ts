import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SuperSubCategoryController } from './super-sub-category.controller';
import { SuperSubCategoryService } from './super-sub-category.service';

import { SuperSubCategory, SuperSubCategorySchema } from '../category.schema/super-sub-category.schema';
import { Subcategory, SubcategorySchema } from '../category.schema/sub-category.schema';
import { SubcategoryModule } from '../subcategory/subcategory.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuperSubCategory.name, schema: SuperSubCategorySchema },
      { name: Subcategory.name, schema: SubcategorySchema },
    ]),
    forwardRef(() => SubcategoryModule), // 🔹 ensures circular dependency safety
  ],
  controllers: [SuperSubCategoryController],
  providers: [SuperSubCategoryService],
  exports: [SuperSubCategoryService],
})
export class SuperSubCategoryModule {}
