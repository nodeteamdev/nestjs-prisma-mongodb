import {
  DefaultActions,
  AnyPermissions,
  AuthorizableUser,
  AuthorizableRequest,
  UserBeforeFilterHook,
  UserBeforeFilterTuple,
} from '@modules/casl';
import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export interface OptionsForRoot<
  Roles extends string = string,
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser<Roles>,
  Request = AuthorizableRequest<User>,
> {
  superuserRole?: Roles;
  getUserFromRequest?: (request: Request) => User | undefined;
  getUserHook?:
    | Casl.AnyClass<UserBeforeFilterHook<User>>
    | UserBeforeFilterTuple<User>;
}

export interface OptionsForFeature<
  Roles extends string = string,
  Subjects extends Casl.Subject = Casl.Subject,
  Actions extends string = DefaultActions,
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser<Roles>,
> {
  permissions: AnyPermissions<Roles, Subjects, Actions, User>;
}

export interface OptionsForRootAsync<
  Roles extends string = string,
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser<Roles>,
  Request = AuthorizableRequest<User>,
> extends Pick<ModuleMetadata, 'imports'> {
  useFactory: FactoryProvider<
    | Promise<OptionsForRoot<Roles, User, Request>>
    | OptionsForRoot<Roles, User, Request>
  >['useFactory'];
  inject?: FactoryProvider['inject'];
}
