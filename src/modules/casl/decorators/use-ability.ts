import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CASL_META_ABILITY } from '../casl.constants';
import {
  SubjectBeforeFilterHook,
  SubjectBeforeFilterTuple,
  AuthorizableRequest,
} from '@modules/casl';

export function UseAbility<
  Subject = Casl.AnyObject,
  Request = AuthorizableRequest,
>(
  action: string,
  subject: Casl.AnyClass<Subject>,
  subjectHook?:
    | Casl.AnyClass<SubjectBeforeFilterHook<Subject, Request>>
    | SubjectBeforeFilterTuple<Subject, Request>,
): CustomDecorator {
  return SetMetadata(CASL_META_ABILITY, { action, subject, subjectHook });
}
