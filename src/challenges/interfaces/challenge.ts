import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

import { StatsChallenge } from './stats-challenge.enum'

export interface Challenge extends Document {
  dateTimeChallenge: Date
  stats: StatsChallenge
  dateTimeSolicitation: Date
  dateTimeResponse: Date
  requester: Player
  category: string
  players: Array<Player>
  match: Match  
}

export interface Match extends Document{
  category: string
  players: Array<Player>
  def: Player
  result: Array<Result>  
}

export interface Result {
  set: string
}
