import { BadRequestException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name)
  
  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}
  
  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {  
    const { email } = createPlayerDto
    
    const playerFound = await this.playerModel.findOne({email}).exec()
    
    if(playerFound) {
     throw new BadRequestException(`Email: ${email} já cadastrado anteriormente`)
    }

    const createdPlayer = new this.playerModel(createPlayerDto)   
    return await createdPlayer.save()    
  }
  
  async updatePlayer(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {  
    const playerFound = this.findPlayer(_id)
    if(!playerFound) {
      throw new NotFoundException(`Jogador com o id: ${_id} não encontrado`)
    }
    await this.playerModel.findOneAndUpdate({_id}, {$set: updatePlayerDto}).exec()  
  }
  
  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec()
  }
  
  async getPlayerByEmail(email: string): Promise<Player> {
    const foundPlayer = await this.playerModel.findOne({email}).exec()
    if(!foundPlayer) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`)
    }
    return foundPlayer
  }
  
  async getPlayerById(_id: string): Promise<Player> {
    const foundPlayer = this.findPlayer(_id)
    if(!foundPlayer) {
      throw new NotFoundException(`Jogador com id: ${_id} não encontrado`)
    }
    return foundPlayer
  }
  
  async deletePlayer(_id: string): Promise<any> {
    this.findPlayer(_id)
    return await this.playerModel.deleteOne({_id}).exec()
  }
  
  private async findPlayer(_id: string): Promise<Player> {
    return await this.playerModel.findOne({_id}).exec()
  }
}
