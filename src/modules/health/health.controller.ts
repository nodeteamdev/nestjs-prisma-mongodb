import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { SkipAuth } from '@modules/auth/skip-auth.guard';

@Controller('health')
export default class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get()
  @SkipAuth()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => ({ info: { status: 'up', message: 'Everything is fine' } }),
    ]);
  }

  @Get('memory')
  @SkipAuth()
  @HealthCheck()
  checkMemory(): Promise<HealthCheckResult> {
    /**
     * @description The process should not use more than 1400MB memory
     * The health check will return an object like this:
     * {
     *  status: "ok",
     *  info: {
     *    memory_heap: {
     *      status: "up"
     *    }
     *  },
     * error: { },
     *   details: {
     *    memory_heap: {
     *     status: "up"
     *    }
     *   }
     * }
     */
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 1400 * 1024 * 1024),
    ]);
  }

  @Get('disk')
  @SkipAuth()
  @HealthCheck()
  checkDisk(): Promise<HealthCheckResult> {
    /**
     * @description The process should not use more than 80% disk storage
     * The health check will return an object like this:
     * {
     *  status: "ok",
     *  info: {
     *    storage: {
     *      status: "up"
     *    }
     *  },
     * error: { },
     *   details: {
     *    storage: {
     *     status: "up"
     *    }
     *   }
     * }
     */
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.8 }),
    ]);
  }
}
