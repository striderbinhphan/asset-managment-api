import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {BRProviderService} from './br-provider.service';

@Module({
  imports: [HttpModule],
  providers: [BRProviderService],
  exports: [BRProviderService],
})
export class BRProviderModule {}
