import { Challenge, Match } from './interfaces/challenge';
import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChallengeDto } from './Dtos/create-challenge.dto';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { StatsChallenge } from './interfaces/stats-challenge.enum';
import { UpdateChallengeDto } from './Dtos/update-challenge.dto';
import { CreateMatchChallengeDto } from './Dtos/create-match-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(@InjectModel('Challenge') private readonly challengeModel: Model<Challenge>, @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService) {}
    
  private readonly logger = new Logger(ChallengesService.name)
    
  async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
   
    const players = await this.playersService.getAllPlayers()
      
    createChallengeDto.players.map(jogadorDto => {
      const playerFilter = players.filter( jogador => jogador._id == jogadorDto._id )
        
      if (playerFilter.length == 0) {
        throw new BadRequestException(`O id ${jogadorDto._id} não é um jogador!`)
      }
        
    })
      
      
    const requesterIsMatchPlayer = await createChallengeDto.players.filter(jogador => jogador._id == createChallengeDto.requester)
      
    this.logger.log(`requesterIsMatchPlayer: ${requesterIsMatchPlayer}`)
      
    if(requesterIsMatchPlayer.length == 0) {
      throw new BadRequestException(`O solicitante deve ser um jogador da partida!`)
    }
      
    const categoriaDoJogador = await this.categoriesService.getPlayerCategory(createChallengeDto.requester)
      
      
    if (!categoriaDoJogador) {
      throw new BadRequestException(`O solicitante precisa estar registrado em uma categoria!`)
    }
      
    const createdChallenge = new this.challengeModel(createChallengeDto)
    createdChallenge.category = categoriaDoJogador.category
    createdChallenge.dateTimeSolicitation = new Date()
      
    createdChallenge.stats = StatsChallenge.PENDING
    this.logger.log(`desafioCriado: ${JSON.stringify(createdChallenge)}`)
    return await createdChallenge.save()
      
  }
    
  async getChallenges(): Promise<Challenge[]> {
    return await this.challengeModel.find()
    .populate("requester")
    .populate("players")
    .populate("match")
    .exec()
  }
    
  async getChallengesOfOnePlayer(_id: any): Promise<Challenge[]> {
      
    const players = await this.playersService.getAllPlayers()
      
    const playerFilter = players.filter(players => players._id == _id)
      
    if (playerFilter.length == 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador!`)
    }
      
    return await this.challengeModel.find()
    .where('players')
    .in(_id)
    .populate("requester")
    .populate("players")
    .populate("match")
    .exec()
      
  }
    
  async updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
      
    const foundChallenge = await this.challengeModel.findById(_id).exec()
      
    if (!foundChallenge) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`)
    }
      
      
    if (updateChallengeDto.stats){
      foundChallenge.dateTimeResponse = new Date()         
    }
    foundChallenge.stats = foundChallenge.stats
    foundChallenge.dateTimeChallenge = foundChallenge.dateTimeChallenge
      
    await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec()
      
  }
    
  async createChallengeMatch(_id: string, createMatchChallengeDto: CreateMatchChallengeDto ): Promise<void> {
      
    const foundChallenge = await this.challengeModel.findById(_id).exec()
      
    if (!foundChallenge) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`)
    }
      
      
    const jogadorFilter = foundChallenge.players.filter(player => player._id === createMatchChallengeDto.def)
      
    this.logger.log(`desafioEncontrado: ${foundChallenge}`)
    this.logger.log(`jogadorFilter: ${jogadorFilter}`)
      
    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O jogador vencedor não faz parte do desafio!`)
    }
      
      
    const partidaCriada = new this.matchModel(createMatchChallengeDto)
      
      
    partidaCriada.category = foundChallenge.category
      
      
    partidaCriada.players = foundChallenge.players
      
    const resultado = await partidaCriada.save()
      
      
    foundChallenge.stats = StatsChallenge.ACCOMPLISHED
      
      
    foundChallenge.match = resultado._id
      
    try {
      await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec() 
    } catch (error) {
        
      await this.matchModel.deleteOne({_id: resultado._id}).exec();
      throw new InternalServerErrorException()
    }
  }
    
  async deleteChallenge(_id: string): Promise<void> {
      
    const foundChallenge = await this.challengeModel.findById(_id).exec()
      
    if (!foundChallenge) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`)
    }
      
    foundChallenge.stats = StatsChallenge.CANCELED
      
    await this.challengeModel.findOneAndUpdate({_id},{$set: foundChallenge}).exec() 
      
  }
    
    
}
  