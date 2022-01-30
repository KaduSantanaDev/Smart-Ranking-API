import { IsOptional } from "class-validator";
import { StatsChallenge } from "../interfaces/stats-challenge.enum";

export class UpdateChallengeDto {
  @IsOptional()
  dateTimeChallenge: Date;

  @IsOptional()
  stats: StatsChallenge;
}
