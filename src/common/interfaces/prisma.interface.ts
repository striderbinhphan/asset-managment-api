import {PrismaClient} from '@prisma/client';
import {DefaultArgs} from '@prisma/client/runtime/library';

export type PrismaTransactionType = Omit<
  PrismaClient<any, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
