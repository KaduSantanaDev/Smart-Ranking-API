import { Result } from './../interfaces/challenge';
import { Player } from 'src/players/interfaces/player.interface';
import { IsNotEmpty } from "class-validator"

export class CreateMatchChallengeDto {

  @IsNotEmpty()
  def: Player

  @IsNotEmpty()
  result: Array<Result>
  
}
