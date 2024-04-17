export { CaslModule } from './casl.module';

export type { AuthorizableUser } from './interfaces/authorizable-user.interface';
export type { AuthorizableUserMeta } from './interfaces/authorizable-user-meta.interface';

export type { AuthorizableRequest } from './interfaces/request.interface';

export {
  CaslConditions,
  CaslSubject,
  CaslUser,
  UseAbility,
} from './decorators';

export type {
  SubjectBeforeFilterHook,
  SubjectBeforeFilterTuple,
  UserBeforeFilterHook,
  UserBeforeFilterTuple,
} from './interfaces/hooks.interface';

export type {
  AnyPermissions,
  DefinePermissions,
  Permissions,
} from './interfaces/permissions.interface';

export type {
  OptionsForRoot,
  OptionsForFeature,
} from './interfaces/options.interface';

export { Actions, DefaultActions } from './actions.enum';

export { ConditionsProxy } from './proxies/conditions.proxy';

export { UserProxy } from './proxies/user.proxy';

export { SubjectProxy } from './proxies/subject.proxy';

export { AccessGuard } from './access.guard';

export { AccessService } from './access.service';

export type { InferSubjects } from '@casl/ability';
