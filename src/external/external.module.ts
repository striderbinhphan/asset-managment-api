import {Module} from '@nestjs/common';
import {BRProviderModule} from './br-provider/br-provider.module';

@Module({
  imports: [BRProviderModule],
  exports: [BRProviderModule],
})
export class ExternalModule {}
