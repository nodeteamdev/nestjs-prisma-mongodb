import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import HealthController from '@modules/health/health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export default class HealthModule {}
