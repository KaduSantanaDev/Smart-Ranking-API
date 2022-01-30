import { Body, Controller, Logger, UsePipes, ValidationPipe, Post, Get, Query, Param, Delete, Put } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './Dtos/create-challenge.dto';
import { CreateMatchChallengeDto } from './Dtos/create-match-challenge.dto';
import { UpdateChallengeDto } from './Dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge';
import { ChallengeStatsValidationPipe } from './pipes/challenge-stats-validation.pipe';

@Controller('/api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challangesService: ChallengesService) {}
  private readonly logger = new Logger(ChallengesController.name)

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    this.logger.log(`createChallengesDto: ${JSON.stringify(createChallengeDto)}`)
    return this.challangesService.createChallenge(createChallengeDto)
  }
  
  @Get()
    async consultarDesafios(@Query('idPlayer') _id: string): Promise<Array<Challenge>> {
    return _id ? await this.challangesService.getChallengesOfOnePlayer(_id) : await this.challangesService.getChallenges()
  }

  @Put('/:challenge')
  async atualizarDesafio(@Body(ChallengeStatsValidationPipe) updateChallengeDto: UpdateChallengeDto, @Param('challenge') _id: string): Promise<void> {
    await this.challangesService.updateChallenge(_id, updateChallengeDto)

  }    

  @Post('/:challenge/match/')
   async createChallengeMatch(@Body(ValidationPipe) createChallengeMatchDto: CreateMatchChallengeDto, @Param('challenge') _id: string): Promise<void> {
    return await this.challangesService.createChallengeMatch(_id, createChallengeMatchDto)           
  }

  @Delete('/:_id')
   async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    this.challangesService.deleteChallenge(_id)
  }

}
