import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Body, Controller, Delete, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/jogadores')
export class PlayersController { 
  constructor(private readonly playerService: PlayersService) {   
  }
  
  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playerService.createUpdatePlayer(createPlayerDto)
  }
  
  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if(email) {
      return await this.playerService.getPlayerByEmail(email)
    } else {
      return await this.playerService.getAllPlayers()      
    }
  }
  
  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    this.playerService.deletePlayer(email)
  }
}
