import supertest from 'supertest';
export interface IMakeRequest {
  get: (url: string) => supertest.Test;
  getAuth: (url: string, token: string) => supertest.Test;
  post: (url: string) => supertest.Test;
  postAuth: (url: string, token: string) => supertest.Test;
  delete: (url: string) => supertest.Test;
  deleteAuth: (url: string, token: string) => supertest.Test;
  put: (url: string) => supertest.Test;
  putAuth: (url: string, token: string) => supertest.Test;
  patch: (url: string) => supertest.Test;
  patchAuth: (url: string, token: string) => supertest.Test;
}
