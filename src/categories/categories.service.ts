import { UpdateCategoryDto } from './Dtos/update-category.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './Dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}
  
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { category } = createCategoryDto
    
    const foundCategory = await this.categoryModel.findOne({category}).exec()
    
    if(foundCategory) throw new BadRequestException(`Categoria ${foundCategory} já cadastrada`)
    
    const createdCategory = new this.categoryModel(createCategoryDto)
    return await createdCategory.save()
  }
  
  async getCategories(): Promise<Category[]> {
    return await this.categoryModel.find().exec()
  }
  
  async getCategorieById(_id: string): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({_id}).exec()
    
    if(!foundCategory) throw new NotFoundException(`Categoria informada não encontrada`)
    
    return foundCategory
  } 
  
  async updateCategory(_id: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    const foundCategory = await this.categoryModel.findOne({_id}).exec()
    
    if(!foundCategory) throw new NotFoundException(`Categoria informada não encontrada`)
    await this.categoryModel.findByIdAndUpdate({_id}, {$set: updateCategoryDto}).exec()
  }
}
