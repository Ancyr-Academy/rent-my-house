import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app-service';
import {
  ReserveHouseCommand,
  ReserveHouseCommandHandler,
} from '../commands/reserve-house';
import { AuthContext } from '../../domain/models/auth-context';

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
  reserveHouse(@Body() body: any) {
    return this.reserveHouseCommandHandler.execute(
      new ReserveHouseCommand(
        body,
        new AuthContext({
          id: 'anthony',
          emailAddress: 'anthony@ancyracademy.fr',
        }),
      ),
    );
  }
}
