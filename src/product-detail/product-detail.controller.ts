import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { ProductDetailService } from './product-detail.service';
import { CreateProductDetailDto } from './dto/create-product-detail.dto';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { QueryProductDto } from './dto/query-product.dto';
    const baseUrl = process.env.SERVER_BASE_URL;
@Controller('product-detail')
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) { }

  // your LAN IP (change if needed)
  
  

  @Post('AddProduct')
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateProductDetailDto,
  ) {

    if (files?.length > 0) {
      dto.imageUrls = files.map(file => `${baseUrl}uploads` + file.filename);
    }
    return this.productDetailService.create(dto);
  }

  @Get()
  findAll() {
    return this.productDetailService.findAll();
  }
  @Get('searchProducts')
  async searchProducts(@Query() query: any) {
    console.log('Received search query:', query);
    return this.productDetailService.searchProducts(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDetailService.findOne(id);
  }



  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: UpdateProductDetailDto,
  ) {
    if (files?.length > 0) {
      dto.imageUrls = files.map(file =>  `${baseUrl}uploads` + file.filename);
    }
    return this.productDetailService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDetailService.remove(id);
  }
}
