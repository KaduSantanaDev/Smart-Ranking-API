import { Player } from 'src/players/interfaces/player.interface';
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsNotEmpty()
  requester: Player;

  @IsArray()
  @ArrayMinSize(2)
  players: Array<Player>


}
