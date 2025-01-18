import {Controller, Get} from '@nestjs/common';
import {version} from './version';

@Controller('app')
export class AppController {
  @Get('version')
  version(): string {
    return version;
  }
}
