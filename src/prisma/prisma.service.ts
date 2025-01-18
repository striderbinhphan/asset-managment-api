import {Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaClient, Prisma} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const config: any = {
      log: [
        {emit: 'stdout', level: 'info'},
        {emit: 'stdout', level: 'warn'},
        {emit: 'stdout', level: 'error'},
      ],
      errorFormat: 'colorless',
      transactionOptions: {
        maxWait: 60000,
        timeout: 80000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
      },
    };
    if (process.env.LOG_QUERIES === 'true') {
      config.log.push({emit: 'stdout', level: 'query'});
    }
    super(config);
  }
  async onModuleInit() {
    await this.$connect();
    if (process.env.LOG_QUERY_TIME === 'true') {
      this.$use(async (params, next) => {
        const before = Date.now();

        // console.log(`[Query_Time] Start ${params.model}.${params.action}`);
        try {
          const result = await next(params);

          const after = Date.now();

          // console.log(`[Query_Time] ${params.model}.${params.action} success took ${after - before}ms`);

          return result;
        } catch (e) {
          console.error(`[Query_Error] ${params.model}.${params.action} error message ${e.message}`);
          console.error(e);
          throw new Error(e);
        }
      });
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
