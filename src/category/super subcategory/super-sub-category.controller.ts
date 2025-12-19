import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { SuperSubCategoryService } from './super-sub-category.service';
import { CreateSuperSubCategoryDto } from '../dto/create-super-sub-category.dto';
import { UpdateSuperSubCategoryDto } from '../dto/update-super-sub-category.dto';

@Controller('super-sub-category')
export class SuperSubCategoryController {
  constructor(private readonly service: SuperSubCategoryService) {}

  @Post()
  create(@Body() dto: CreateSuperSubCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSuperSubCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
