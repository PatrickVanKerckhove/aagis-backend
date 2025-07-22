// __tests__/rest/health.spec.ts
import type supertest from 'supertest';
import packageJson from '../../package.json';
import withServer from '../helpers/withServer';

describe('Health', () => {
  let request: supertest.Agent;
    
  withServer((r) => {
    request = r;
  });

  describe('GET /api/health/ping', () => {
    const url = '/api/health/ping';

    it('should return pong', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ pong: true });
    });
  });

  describe('GET /api/health/version', () => {
    const url = '/api/health/version';

    it('should return version from package.json', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        env: 'testing',
        version: packageJson.version,
        name: packageJson.name,
      });
    });
  });
});
