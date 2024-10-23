import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app-service';
import {
  ReserveHouseCommand,
  ReserveHouseCommandHandler,
} from '../commands/reserve-house';
import { AuthContext } from '../../domain/models/auth-context';
import { WithAuthContext } from '../auth/app-auth-guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reserveHouseCommandHandler: ReserveHouseCommandHandler,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('reserve-house')
  reserveHouse(@Body() body: any, @WithAuthContext() authContext: AuthContext) {
    return this.reserveHouseCommandHandler.execute(
      new ReserveHouseCommand(body, authContext),
    );
  }
}
