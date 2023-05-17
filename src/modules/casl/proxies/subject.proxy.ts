import { AuthorizableUser } from '@modules/casl';
import { AuthorizableRequest } from '@modules/casl';
import { RequestProxy } from './request.proxy';

export class SubjectProxy<Subject = Casl.AnyObject> {
  constructor(
    private request: AuthorizableRequest<AuthorizableUser, Subject>,
  ) {}

  public async get(): Promise<Subject | undefined> {
    const req = this.getRequest();

    if (req.getSubject()) {
      return req.getSubject();
    }

    req.setSubject(await req.getSubjectHook().run(this.request));
    return req.getSubject();
  }

  private getRequest() {
    return new RequestProxy<AuthorizableUser, Subject>(this.request);
  }
}
