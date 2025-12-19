import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/create-category.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'web_image', maxCount: 1 },
      { name: 'app_image', maxCount: 1 },
    ]),
  )
  async createCategory(
    @Body() body: CreateCategoryDTO,
    @UploadedFiles() files: any,
  ) {
    return this.categoryService.createCategory(body, files);
  }

  @Put('editCategory/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'web_image', maxCount: 1 },
      { name: 'app_image', maxCount: 1 },
    ]),
  )
  async updateCategory(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any,
  ) {
    let updateCategoryDto: UpdateCategoryDTO;

    try {
      updateCategoryDto = body.data ? JSON.parse(body.data) : body;
    } catch {
      updateCategoryDto = body;
    }

    return this.categoryService.updateCategory(id, updateCategoryDto, files);
  }

  @Delete('deleteCategory/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Get('getCategoryById/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Get('getAllCategory')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('getFilteredCategories')
  async getFilteredCategories(@Query() filter: any) {
    return this.categoryService.getFilteredCategories(filter);
  }
}
