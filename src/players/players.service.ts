import { CreatePlayerDto } from './dtos/create-player.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PlayersService {
  private players: Player[] = []
  private readonly logger = new Logger(PlayersService.name)
  
  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {  
    const { email } = createPlayerDto
    
    const playerFound = this.players.find(player => player.email === email)
    
    if(playerFound) {
     this.update(playerFound, createPlayerDto)
    } else {
     this.create(createPlayerDto)     
    }
    
  }
  
  async getAllPlayers(): Promise<Player[]> {
    return this.players
  }
  
  async getPlayerByEmail(email: string): Promise<Player> {
    const foundPlayer = this.players.find(player => player.email === email)
    if(!foundPlayer) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`)
    }
    return foundPlayer
  }
  
  async deletePlayer(email): Promise<void> {
    const foundPlayer = this.players.find(player => player.email == email)
    this.players = this.players.filter(player => player.email !== foundPlayer.email)
  }
  
  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, playerPhoneNumber, email } = createPlayerDto
    
    const player: Player = {
      _id: uuidv4(),
      name,
      playerPhoneNumber,
      email,    
      ranking: 'A',
      rankingPosition: 1,
      photoUrl: 'www.google.com.br/foto.jpg'
    }
    this.logger.log(`player: ${JSON.stringify(player)}`) 
    this.players.push(player)
  }
  
  private update(playerFound: Player, createPlayerDto: CreatePlayerDto): void {
    const { name } = createPlayerDto
    
    playerFound.name = name
  }
}
