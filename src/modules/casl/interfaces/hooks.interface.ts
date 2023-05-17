import { AuthorizableRequest } from './request.interface';
import { AuthorizableUser } from './authorizable-user.interface';

export interface SubjectBeforeFilterHook<
  Subject = Casl.AnyObject,
  Request = AuthorizableRequest<AuthorizableUser, Subject>,
> {
  run: (request: Request) => Promise<Subject | undefined>;
}

export type SubjectBeforeFilterTuple<
  Subject = Casl.AnyObject,
  Request = AuthorizableRequest,
> = [
  Casl.AnyClass,
  (service: InstanceType<Casl.AnyClass>, request: Request) => Promise<Subject>,
];

export interface UserBeforeFilterHook<
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  RequestUser = User,
> {
  run: (user: RequestUser) => Promise<User | undefined>;
}

export type UserBeforeFilterTuple<
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  RequestUser = User,
> = [
  Casl.AnyClass,
  (service: InstanceType<Casl.AnyClass>, user: RequestUser) => Promise<User>,
];
