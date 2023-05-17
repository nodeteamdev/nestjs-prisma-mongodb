import {
  ContextType,
  ExecutionContext,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthorizableRequest } from '@modules/casl';

export class ContextProxy {
  constructor(private readonly context: ExecutionContext) {}

  public static create(context: ExecutionContext): ContextProxy {
    return new ContextProxy(context);
  }

  public async getRequest(): Promise<AuthorizableRequest> {
    switch (this.context.getType<ContextType>()) {
      case 'http':
      case 'ws':
        return this.context.switchToHttp().getRequest();
      default:
        throw new NotAcceptableException();
    }
  }
}
