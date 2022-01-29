import { CreatePlayerDto } from './dtos/create-player.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name)
  
  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}
  
  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {  
    const { email } = createPlayerDto
    
    const playerFound = await this.playerModel.findOne({email}).exec()
    
    if(playerFound) {
     this.update(createPlayerDto)
    } else {
     this.create(createPlayerDto)     
    }
    
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
  
  async deletePlayer(email): Promise<any> {
    return await this.playerModel.remove({email}).exec()
  }
  
  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto)
    
    return await createdPlayer.save()
  }
  
  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel.findOneAndUpdate({email: createPlayerDto.email}, {$set: createPlayerDto}).exec()
  }
}
