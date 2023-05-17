import {
  SubjectBeforeFilterHook,
  SubjectBeforeFilterTuple,
  AuthorizableRequest,
} from '@modules/casl';

export interface AbilityMetadata<
  Subject = Casl.AnyObject,
  Request = AuthorizableRequest,
> {
  action: string;
  subject: Casl.AnyClass<Subject>;
  subjectHook?:
    | Casl.AnyClass<SubjectBeforeFilterHook<Subject, Request>>
    | SubjectBeforeFilterTuple<Subject, Request>;
}
