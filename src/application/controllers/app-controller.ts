import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from '../services/app-service';
import {
  ReserveHouseCommand,
  ReserveHouseCommandHandler,
} from '../commands/reserve-house';
import { AuthContext } from '../../domain/models/auth-context';
import { WithAuthContext } from '../auth/app-auth-guard';
import {
  AcceptReservation,
  AcceptReservationCommandHandler,
} from '../commands/accept-reservation';
import {
  ViewReservationQuery,
  ViewReservationQueryHandler,
} from '../queries/view-reservations';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reserveHouseCommandHandler: ReserveHouseCommandHandler,
    private readonly acceptReservationCommandHandler: AcceptReservationCommandHandler,
    private readonly viewReservationQueryHandler: ViewReservationQueryHandler,
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

  @HttpCode(200)
  @Post('accept-reservation')
  acceptReservation(
    @Body() body: any,
    @WithAuthContext() authContext: AuthContext,
  ) {
    return this.acceptReservationCommandHandler.execute(
      new AcceptReservation(body, authContext),
    );
  }

  @Get('view-reservations')
  viewReservations(@WithAuthContext() authContext: AuthContext) {
    return this.viewReservationQueryHandler.execute(
      new ViewReservationQuery(null, authContext),
    );
  }
}
