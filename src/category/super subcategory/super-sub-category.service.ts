import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { SuperSubCategory } from '../category.schema/super-sub-category.schema';
import { CreateSuperSubCategoryDto } from '../dto/create-super-sub-category.dto';
import { UpdateSuperSubCategoryDto } from '../dto/update-super-sub-category.dto';
import { Subcategory } from '../category.schema/sub-category.schema';

@Injectable()
export class SuperSubCategoryService {
  constructor(
    @InjectModel(SuperSubCategory.name)
    private readonly superSubModel: Model<SuperSubCategory>,

    @InjectModel(Subcategory.name)
    private readonly subCategoryModel: Model<Subcategory>,
  ) {}

  // CREATE SuperSubCategory
  async create(dto: CreateSuperSubCategoryDto) {
    const { name, categoryId, subCategoryId } = dto;

    // Validate SubCategory
    const subCat = await this.subCategoryModel.findById(subCategoryId);
    if (!subCat) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Sub Category not found with ID: ${subCategoryId}`,
        error: 'Bad Request',
      });
    }

    // Validate Category match
    if (subCat.categoryId.toString() !== categoryId) {
      throw new BadRequestException({
        statusCode: 400,
        message: `SubCategory (${subCategoryId}) does not belong to Category (${categoryId})`,
        error: 'Bad Request',
      });
    }

    // Create SuperSubCategory
    const superSub = await this.superSubModel.create({
      name,
      categoryId: new Types.ObjectId(categoryId),
      subCategoryId: new Types.ObjectId(subCategoryId),
    });

    return {
      statusCode: 201,
      message: 'SuperSubCategory created successfully',
      data: superSub,
    };
  }

  // GET ALL SuperSubCategories
  async findAll() {
    const list = await this.superSubModel
      .find()
      .populate('categoryId', 'name')
      .populate('subCategoryId', 'name');

    return {
      statusCode: 200,
      message: 'SuperSubCategories fetched successfully',
      data: list,
    };
  }

  // GET single SuperSubCategory by ID
  async findOne(id: string) {
    const superSub = await this.superSubModel
      .findById(id)
      .populate('categoryId', 'name')
      .populate('subCategoryId', 'name');

    if (!superSub) {
      throw new BadRequestException({
        statusCode: 400,
        message: `SuperSubCategory not found with ID: ${id}`,
        error: 'Bad Request',
      });
    }

    return {
      statusCode: 200,
      message: 'SuperSubCategory fetched successfully',
      data: superSub,
    };
  }

  // UPDATE SuperSubCategory
  async update(id: string, dto: UpdateSuperSubCategoryDto) {
    // Validate if categoryId and subCategoryId are provided
    if (dto.subCategoryId && dto.categoryId) {
      const subCat = await this.subCategoryModel.findById(dto.subCategoryId);
      if (!subCat) {
        throw new BadRequestException({
          statusCode: 400,
          message: `Sub Category not found with ID: ${dto.subCategoryId}`,
          error: 'Bad Request',
        });
      }
      if (subCat.categoryId.toString() !== dto.categoryId) {
        throw new BadRequestException({
          statusCode: 400,
          message: `SubCategory (${dto.subCategoryId}) does not belong to Category (${dto.categoryId})`,
          error: 'Bad Request',
        });
      }
    }

    const updated = await this.superSubModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
        subCategoryId: dto.subCategoryId ? new Types.ObjectId(dto.subCategoryId) : undefined,
      },
      { new: true },
    );

    if (!updated) {
      throw new BadRequestException({
        statusCode: 400,
        message: `SuperSubCategory not found with ID: ${id}`,
        error: 'Bad Request',
      });
    }

    return {
      statusCode: 200,
      message: 'SuperSubCategory updated successfully',
      data: updated,
    };
  }

  // DELETE SuperSubCategory
  async remove(id: string) {
    const deleted = await this.superSubModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new BadRequestException({
        statusCode: 400,
        message: `SuperSubCategory not found with ID: ${id}`,
        error: 'Bad Request',
      });
    }
    return {
      statusCode: 200,
      message: 'SuperSubCategory deleted successfully',
      data: deleted,
    };
  }
}
