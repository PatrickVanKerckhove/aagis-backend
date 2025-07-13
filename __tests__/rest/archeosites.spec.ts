// __tests__/rest/archeosites.spec.ts
import supertest from 'supertest';
import createServer from '../../src/createServer';
import type { Server } from '../../src/createServer';

describe('Archeosites', () => {

  let server: Server;
  let request: supertest.Agent;

  beforeAll(async() => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async() => {
    await server.stop();
  });

  const url = '/api/archeosites';

  describe('GET /api/archeosites', () => {
    it('should 200 and return all archeosites', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
    });
  });
});
