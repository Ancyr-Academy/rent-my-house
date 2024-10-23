import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { I_USER_REPOSITORY, IUserRepository } from '../ports/user-repository';
import { AuthContext } from '../../domain/models/auth-context';

export const WithAuthContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    @Inject(I_USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      return false;
    }

    const user = await this.userRepository.findById(authorization);
    if (!user) {
      return false;
    }

    (request as any).user = new AuthContext({
      id: user.getId(),
      emailAddress: user.getEmailAddress(),
    });

    return true;
  }
}
