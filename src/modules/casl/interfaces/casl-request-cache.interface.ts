import {
  SubjectBeforeFilterHook,
  UserBeforeFilterHook,
  AuthorizableUser,
  ConditionsProxy,
} from '@modules/casl';

export interface CaslRequestCache<
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  Subject = Casl.AnyObject,
> {
  user?: User;
  subject?: Subject;
  conditions?: ConditionsProxy;
  hooks: {
    user: UserBeforeFilterHook<User>;
    subject: SubjectBeforeFilterHook<Subject>;
  };
}
