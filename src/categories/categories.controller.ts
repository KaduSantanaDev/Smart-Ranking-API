import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './Dtos/create-category.dto';
import { UpdateCategoryDto } from './Dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }
  
  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto)
  }
  
  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories()
  }
  
  @Get('/:_id')
  async getCategorieById(@Param('_id') _id: string): Promise<Category> {
    return await this.categoriesService.getCategorieById(_id)
  }
  
  @Put('/:_id')
  async updateCateogry(@Body() updateCategoryDto: UpdateCategoryDto, @Param('_id') _id: string): Promise<void> {
    return await this.categoriesService.updateCategory(_id, updateCategoryDto)
  }
}
