import { PlayersService } from './../players/players.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { PlayersModule } from 'src/players/players.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { MatchSchema } from './interfaces/match.schema';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Challenge', schema: ChallengeSchema},
      {name: 'Match', schema: MatchSchema}]),
    PlayersModule,
    CategoriesModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],

})
export class ChallengesModule {}
