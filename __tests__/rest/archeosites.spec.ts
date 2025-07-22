// __tests__/rest/archeosites.spec.ts
import type supertest from 'supertest';
import { AstronomischEvent, Prisma, WendeType } from '@prisma/client';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';

const data = {
  archeosites: [
    {
      id:1,
      naam: 'test naam 1',
      land: 'test land 1',
      beschrijving: 'test beschrijving 1',
      breedtegraad: new Prisma.Decimal('51.2'),
      lengtegraad: new Prisma.Decimal('-1.8'),
      hoogte: new Prisma.Decimal('100.5'),
      foto: '/images/testimage1.jpg',
    },{
      id: 2,
      naam: 'test naam 2',
      land: 'test land 2',
      beschrijving: 'test beschrijving 2',
      breedtegraad: new Prisma.Decimal('50.5'),
      lengtegraad: new Prisma.Decimal('0.1'),
      hoogte: new Prisma.Decimal('0'),
      foto: '/images/testimage2.jpg',
    }],
  wendes: [{
    id:1,
    siteId: 1,
    wendeType: WendeType.ZOMERZONNEWENDE,
    astronomischEvent: AstronomischEvent.OPGANG,
    datumTijd: new Date(2023, 5, 21, 4, 52),
    azimuthoek: new Prisma.Decimal('50.0'),
  },{
    id: 2,
    siteId: 1,
    wendeType: WendeType.WINTERZONNEWENDE,
    astronomischEvent: AstronomischEvent.OPGANG,
    datumTijd: new Date(2023, 11, 22, 8, 9),
    azimuthoek: new Prisma.Decimal('128.0'),
  }, {
    id: 3,
    siteId: 2,
    wendeType: WendeType.WINTERZONNEWENDE,
    astronomischEvent: AstronomischEvent.OPGANG,
    datumTijd: new Date(2023, 11, 21, 8, 58),
    azimuthoek: new Prisma.Decimal('134.0'),
  }],
  markers: [{
    id:1,
    siteId: 1,
    wendeId: 1,
    naam: 'test marker 1',
    beschrijving: 'test marker beschrijving 1',
    breedtegraad: new Prisma.Decimal('51.18'),
    lengtegraad: new Prisma.Decimal('-1.82'),
  }, {
    id:2,
    siteId: 2,
    wendeId: 3,
    naam: 'test marker 2',
    beschrijving: 'test marker beschrijving 2',
    breedtegraad: new Prisma.Decimal('53.7'),
    lengtegraad: new Prisma.Decimal('-6.48'),
  }],
};
const dataToDelete ={
  archeosites: [1, 2],
  wendes: [1, 2, 3],
  markers: [1, 2],
};

describe('Archeosites', () => {
  let authHeader: string;
  let request: supertest.Agent;
  
  withServer((r) => {
    request = r;
  });

  beforeAll(async() =>{
    authHeader = await login(request);
  });

  const url = '/api/archeosites';

  describe('GET /api/archeosites', () => {
    
    beforeAll(async() => {
      await prisma.archeologischeSite.createMany({data: data.archeosites});
      await prisma.wende.createMany({data: data.wendes});
      await prisma.orientatieMarker.createMany({data: data.markers});
    });
    afterAll(async() => {
      await prisma.archeologischeSite.deleteMany({
        where: { id: { in: dataToDelete.archeosites}},
      });
      await prisma.wende.deleteMany({
        where: { id: { in: dataToDelete.wendes}},
      });
      await prisma.orientatieMarker.deleteMany({
        where: { id: { in: dataToDelete.markers}},
      });
    });

    it('should 200 and return all archeosites', async () => {
      const response = await request
        .get(url)
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id:1,
            naam: 'test naam 1',
            land: 'test land 1',
            beschrijving: 'test beschrijving 1',
            breedtegraad: '51.2',
            lengtegraad: '-1.8',
            hoogte: '100.5',
            foto: '/images/testimage1.jpg',
          },{
            id: 2,
            naam: 'test naam 2',
            land: 'test land 2',
            beschrijving: 'test beschrijving 2',
            breedtegraad: '50.5',
            lengtegraad: '0.1',
            hoogte: '0',
            foto: '/images/testimage2.jpg',
          },
        ]),
      );
    });
    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/archeosites/:id', () => {
    beforeAll(async() => {
      await prisma.archeologischeSite.createMany({data: data.archeosites});
      await prisma.wende.createMany({data: data.wendes});
      await prisma.orientatieMarker.createMany({data: data.markers});
    });
    afterAll(async() => {
      await prisma.archeologischeSite.deleteMany({
        where: { id: { in: dataToDelete.archeosites}},
      });
      await prisma.wende.deleteMany({
        where: { id: { in: dataToDelete.wendes}},
      });
      await prisma.orientatieMarker.deleteMany({
        where: { id: { in: dataToDelete.markers}},
      });
    });
    it('should 200 and return the requested archeosite', async()=>{
      const response = await request
        .get(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id:1,
        naam: 'test naam 1',
        land: 'test land 1',
        beschrijving: 'test beschrijving 1',
        breedtegraad: '51.2',
        lengtegraad: '-1.8',
        hoogte: '100.5',
        foto: '/images/testimage1.jpg',
        orientatieMarkers: [{
          id:1,
          wendeId: 1,
          naam: 'test marker 1',
          beschrijving: 'test marker beschrijving 1',
          breedtegraad: '51.18',
          lengtegraad: '-1.82',
        }],
        wendes: [{
          id:1,
          wendeType: WendeType.ZOMERZONNEWENDE,
          astronomischEvent: AstronomischEvent.OPGANG,
          datumTijd: '2023-06-21T02:52:00.000Z',
          azimuthoek: '50',
        },{
          id: 2,
          wendeType: WendeType.WINTERZONNEWENDE,
          astronomischEvent: AstronomischEvent.OPGANG,
          datumTijd: '2023-12-22T07:09:00.000Z',
          azimuthoek: '128',
        }],
      });
    });
  });

  describe('POST /api/archeosites', () => {
    const archeositesToDelete: number[] = [];

    afterAll(async() => {
      await prisma.archeologischeSite.deleteMany({
        where: { id: { in: archeositesToDelete}},
      });
    });
  
    it('should 201 and return the created archeosite', async () => {
      const response = await request
        .post(url)
        .set('Authorization', authHeader)
        .send({
          naam: 'test naam',
          land: 'test land',
          beschrijving: 'test beschrijving',
          breedtegraad: '50.2',
          lengtegraad: '-12.8',
          hoogte: '10.5',
          foto: '/images/testimage.jpg',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe('test naam');
      expect(response.body.land).toBe('test land');
      expect(response.body.beschrijving).toBe('test beschrijving');
      expect(response.body.breedtegraad).toBe('50.2');
      expect(response.body.lengtegraad).toBe('-12.8');
      expect(response.body.hoogte).toBe('10.5');
      expect(response.body.foto).toBe('/images/testimage.jpg');

      archeositesToDelete.push(response.body.id);
    });
  });

  describe('PUT /api/archeosites', () => {
    beforeAll(async() => {
      await prisma.archeologischeSite.createMany({data: data.archeosites});
      await prisma.wende.createMany({data: data.wendes});
      await prisma.orientatieMarker.createMany({data: data.markers});
    });
    afterAll(async() => {
      await prisma.archeologischeSite.deleteMany({
        where: { id: { in: dataToDelete.archeosites}},
      });
      await prisma.wende.deleteMany({
        where: { id: { in: dataToDelete.wendes}},
      });
      await prisma.orientatieMarker.deleteMany({
        where: { id: { in: dataToDelete.markers}},
      });
    });
    it('should 200 and return the updated archeologicSite', async()=>{
      const response = await request
        .put(`${url}/1`)
        .send({
          naam: 'updated naam',
          land: 'updated land',
          beschrijving: 'updated beschrijving',
          breedtegraad: new Prisma.Decimal('53.2'),
          lengtegraad: new Prisma.Decimal('-10.8'),
        })
        .set('Authorization', authHeader);

      /*console.log('Response:', response.statusCode, response.body);
      console.log('Validation errors:', JSON.stringify(response.body.details, null, 2)); */

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.naam).toBe('updated naam');
      expect(response.body.land).toBe('updated land');
      expect(response.body.beschrijving).toBe('updated beschrijving');
      expect(response.body.breedtegraad).toBe('53.2');
      expect(response.body.lengtegraad).toBe('-10.8');
    });
  });

  describe('DELETE /api/archeosites/:id', () => {
    beforeAll(async() => {
      await prisma.archeologischeSite.createMany({data: data.archeosites});
      await prisma.wende.createMany({data: data.wendes});
      await prisma.orientatieMarker.createMany({data: data.markers});
    });
    afterAll(async() => {
      await prisma.archeologischeSite.deleteMany({
        where: { id: { in: dataToDelete.archeosites}},
      });
      await prisma.wende.deleteMany({
        where: { id: { in: dataToDelete.wendes}},
      });
      await prisma.orientatieMarker.deleteMany({
        where: { id: { in: dataToDelete.markers}},
      });
    });
    it('should 204 and return nothing', async ()=>{
      const response = await request
        .delete(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
