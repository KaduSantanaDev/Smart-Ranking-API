import { PipeTransform, BadRequestException } from '@nestjs/common';
import { StatsChallenge } from '../interfaces/stats-challenge.enum';

export class ChallengeStatsValidationPipe implements PipeTransform {
  readonly allowedStats = [
    StatsChallenge.ACCEPTED,
    StatsChallenge.DECLINE,
    StatsChallenge.CANCELED
  ];

  transform(value: any) {
    const stats = value.status.toUpperCase();

    if (!this.isValidStats(stats)) {
      throw new BadRequestException(`${stats} é um status inválido`);
    }

    return value;
  }

  private isValidStats(stats: any) {
    const idx = this.allowedStats.indexOf(stats);
    return idx !== -1;
  }
}
