import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDetailDto } from './dto/create-product-detail.dto';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';
import { ProductDetail } from './entities/product-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectModel(ProductDetail.name)
    private productModel: Model<ProductDetail>,
  ) { }

  async create(createProductDto: CreateProductDetailDto) {
    try {
      const existing = await this.productModel.findOne({ SKU: createProductDto.SKU });
      if (existing) throw new BadRequestException('SKU already exists');

      const product = new this.productModel(createProductDto);
      const saved = await product.save();

      return { message: 'Product created successfully', data: saved };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Error creating product');
    }
  }

  async findAll() {
    try {
      const products = await this.productModel.find().exec();
      if (!products.length) return { message: 'No products found', data: [] };
      return { message: 'All products retrieved', data: products };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid product ID');

      const product = await this.productModel.findById(id).exec();
      if (!product) throw new NotFoundException('Product not found');

      return { message: 'Product retrieved successfully', data: product };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateProductDetailDto: UpdateProductDetailDto) {
    try {
      if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid product ID');

      const updated = await this.productModel
        .findByIdAndUpdate(id, updateProductDetailDto, { new: true })
        .exec();

      if (!updated) throw new NotFoundException('Product not found');

      return { message: 'Product updated successfully', data: updated };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid product ID');

      const deleted = await this.productModel.findByIdAndDelete(id).exec();
      if (!deleted) throw new NotFoundException('Product not found');

      return { message: 'Product deleted successfully', data: deleted };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchProducts(query: QueryProductDto) {
    console.log('Search Query:', query); // Debugging line
    const {
      search,
      subcategoryId,
      SalesPrice,
      status,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};


    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { Name: regex },
        { Description: regex },
      ];
    }

    if (subcategoryId) {
      filter.subcategoryId = subcategoryId;
    }

    
    if (SalesPrice) {
      filter.SalesPrice = SalesPrice;
    }

    if (status) {
      filter.STATUS = status;
    }

    if (minPrice || maxPrice) {
      filter.Price = {};
      if (minPrice) filter.Price.$gte = Number(minPrice);
      if (maxPrice) filter.Price.$lte = Number(maxPrice);
    }


    if (inStock) {
      filter.Stock = inStock;
    }


    const skip = (Number(page) - 1) * Number(limit);

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    console.log('Filter:', filter);
    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort(sort),

      this.productModel.countDocuments(filter),
    ]);

    return {
      success: true,
      message: 'Products fetched successfully',
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    };
  }

}
