import BaseContext from '@tests/e2e/context/base-context';
import TestService from '@tests/e2e/test.service';
import { AdminUserInterface } from '@tests/e2e/interfaces/admin-user.interface';
import { IMakeRequest } from '@tests/e2e/interfaces/make-request.interface';

class DefaultContext {
  public request!: IMakeRequest;

  public admin!: AdminUserInterface;

  public adminAccessToken!: string;

  public service!: TestService;

  async init(baseCtx: BaseContext) {
    this.request = baseCtx.request;

    this.admin = baseCtx.globalAdmin;
    this.adminAccessToken = baseCtx.globalAdmin.accessToken;

    this.service = baseCtx.service;
  }
}

export default DefaultContext;
