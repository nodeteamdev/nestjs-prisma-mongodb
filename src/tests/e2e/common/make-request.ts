import { Server } from 'http';
import { IMakeRequest } from '@tests/e2e/interfaces/make-request.interface';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as request from 'supertest';

export default (server: Server): IMakeRequest => ({
  get: (url: string) =>
    request(server)
      .get(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json'),
  getAuth: (url: string, token: string) =>
    request(server)
      .get(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${token}` }),
  post: (url: string) =>
    request(server)
      .post(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json'),
  postAuth: (url: string, token: string) =>
    request(server)
      .post(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${token}` }),
  delete: (url: string) =>
    request(server)
      .delete(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json'),
  deleteAuth: (url: string, token: string) =>
    request(server)
      .delete(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${token}` }),
  put: (url: string) =>
    request(server)
      .put(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json'),
  putAuth: (url: string, token: string) =>
    request(server)
      .put(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${token}` }),
  patch: (url: string) =>
    request(server)
      .patch(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json'),
  patchAuth: (url: string, token: string) =>
    request(server)
      .patch(url)
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${token}` }),
});
