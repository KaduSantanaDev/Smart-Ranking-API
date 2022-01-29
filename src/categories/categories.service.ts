import { PlayersService } from './../players/players.service';
import { UpdateCategoryDto } from './Dtos/update-category.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './Dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>, private readonly playersService: PlayersService) {}
  
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { category } = createCategoryDto
    
    const foundCategory = await this.categoryModel.findOne({category}).exec()
    
    if(foundCategory) throw new BadRequestException(`Categoria ${foundCategory} já cadastrada`)
    
    const createdCategory = new this.categoryModel(createCategoryDto)
    return await createdCategory.save()
  }
  
  async getCategories(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec()
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
  
  async createCategoryPlayer(params: string[]): Promise<void> {
    const _id = params['_id']
    const _idPlayer = params['_idPlayer']
    
    const foundCategory = await this.categoryModel.findOne({_id}).exec()
    const createdCategoryPlayer = await this.categoryModel.find({_id}).where('players').in(_idPlayer).exec()
    
    await this.playersService.getPlayerById(_idPlayer)
    
    if(!foundCategory) throw new NotFoundException(`Categoria informada não encontrada`)
    
    if(createdCategoryPlayer.length > 0) throw new BadRequestException(`Player ${_idPlayer} já cadastrado nesta categoria`)
    
    foundCategory.players.push(_idPlayer)
    
    await this.categoryModel.findOneAndUpdate({_id}, {$set: foundCategory}).exec()
  }
}
