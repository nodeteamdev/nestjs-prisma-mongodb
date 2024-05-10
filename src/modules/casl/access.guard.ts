import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { AccessService } from '@modules/casl/access.service';
import { CaslConfig } from '@modules/casl/casl.config';
import { CASL_META_ABILITY } from '@modules/casl/casl.constants';
import { AbilityMetadata } from '@modules/casl/interfaces/ability-metadata.interface';
import { subjectHookFactory } from '@modules/casl/factories/subject-hook.factory';
import { userHookFactory } from '@modules/casl/factories/user-hook.factory';
import { RequestProxy } from '@modules/casl/proxies/request.proxy';
import { ContextProxy } from '@modules/casl/proxies/context.proxy';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly accessService: AccessService,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ability = this.reflector.get<AbilityMetadata | undefined>(
      CASL_META_ABILITY,
      context.getHandler(),
    );

    const request = await ContextProxy.create(context).getRequest();
    const { getUserHook } = CaslConfig.getRootOptions();
    const req = new RequestProxy(request);

    req.setUserHook(await userHookFactory(this.moduleRef, getUserHook));
    req.setSubjectHook(
      await subjectHookFactory(this.moduleRef, ability?.subjectHook),
    );

    return this.accessService.canActivateAbility(request, ability);
  }
}
