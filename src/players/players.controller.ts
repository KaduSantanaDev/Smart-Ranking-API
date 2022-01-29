import { PlayersValidationParameters } from './pipes/players-validation-parameters.pipe';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/jogadores')
export class PlayersController { 
  constructor(private readonly playerService: PlayersService) {   
  }
  
  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerService.createPlayer(createPlayerDto)
  }
  
  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(@Body() updatePlayerDto: UpdatePlayerDto, @Param('_id', PlayersValidationParameters) _id: string): Promise<void> {
    await this.playerService.updatePlayer(_id, updatePlayerDto)
  }
  
  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playerService.getAllPlayers()      
  }
  
  @Get('/email')
  async getPlayerByEmail(@Query('email', PlayersValidationParameters) email: string): Promise<Player[] | Player> {
    return await this.playerService.getPlayerByEmail(email)
  }
  
  @Get('/:_id')
  async getPlayerById(@Param('_id') _id: string): Promise<Player[] | Player> {
    return await this.playerService.getPlayerById(_id)
  }
  
  @Delete('/:_id')
  async deletePlayer(@Param('_id', PlayersValidationParameters) _id: string): Promise<void> {
    this.playerService.deletePlayer(_id)
  }
}
