import {Controller, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {HealthCheck, HealthCheckService, MemoryHealthIndicator, PrismaHealthIndicator} from '@nestjs/terminus';
import {PrismaService} from '../prisma/prisma.service';

@Controller()
@ApiTags('Health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly prismaHealthCheck: PrismaHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('health')
  @HealthCheck()
  async check() {
    return this.healthCheckService.check([
      async () => this.prismaHealthCheck.pingCheck('database', this.prismaService),
      async () => this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
    ]);
  }
}
