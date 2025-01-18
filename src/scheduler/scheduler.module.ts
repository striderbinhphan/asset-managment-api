import {Module} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {PrismaModule} from '../prisma/prisma.module';
import {SchedulerService} from './scheduler.service';
import {ExternalModule} from '../external/external.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, ExternalModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
