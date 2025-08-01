// __tests__/rest/markers.spec.ts
import type supertest from 'supertest';
import { Prisma, AstronomischEvent, WendeType } from '@prisma/client';
import { prisma } from '../../src/data';
import { login } from '../helpers/login';
import withServer from '../helpers/withServer';

const data = {
  archeosites: [
    {
      id: 1,
      naam: 'test naam 1',
      land: 'test land 1',
      beschrijving: 'test beschrijving 1',
      breedtegraad: new Prisma.Decimal('51'),
      lengtegraad: new Prisma.Decimal('-1.5'),
      hoogte: 100,
      foto: '/images/testimage1.jpg',
      createdBy: 1,
      isPublic: true,
    }],
  wendes: [{
    id:1,
    siteId: 1,
    wendeType: WendeType.ZOMERZONNEWENDE,
    astronomischEvent: AstronomischEvent.OPGANG,
    datumTijd: new Date(2023, 5, 21, 4, 52),
    azimuthoek: new Prisma.Decimal('50.0'),
    calculatedBy: 'PhotoEphemerisApp',
    createdBy: 1,
    isPublic: true,
  },{
    id: 2,
    siteId: 1,
    wendeType: WendeType.WINTERZONNEWENDE,
    astronomischEvent: AstronomischEvent.OPGANG,
    datumTijd: new Date(2023, 11, 22, 8, 9),
    azimuthoek: new Prisma.Decimal('128.0'),
    calculatedBy: 'PhotoEphemerisApp',
    createdBy: 1,
    isPublic: true,
  }],
  markers: [{
    id:1,
    siteId: 1,
    wendeId: 1,
    naam: 'test marker 1',
    beschrijving: 'test marker beschrijving 1',
    breedtegraad: new Prisma.Decimal('51.18'),
    lengtegraad: new Prisma.Decimal('-1.82'),
    createdBy: 1,
    isPublic: true,
  }, {
    id:2,
    siteId: 1,
    wendeId: 2,
    naam: 'test marker 2',
    beschrijving: 'test marker beschrijving 2',
    breedtegraad: new Prisma.Decimal('53.7'),
    lengtegraad: new Prisma.Decimal('-6.48'),
    createdBy: 1,
    isPublic: true,
  }],
};
const dataToDelete ={
  archeosites: [1],
  wendes: [1, 2],
  markers: [1, 2],
};

describe('OrientatieMarkers', () => {
  let authHeader: string;
  let request: supertest.Agent;
    
  withServer((r) => {
    request = r;
  });
  
  beforeAll(async() =>{
    authHeader = await login(request);
  });

  const url = '/api/markers';
  describe('GET /api/markers', () => {
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

    it('should 200 and return all markers', async() => {
      const response = await request
        .get(url)
        .set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            siteId: 1,
            wendeId: 1,
            naam: 'test marker 1',
            beschrijving: 'test marker beschrijving 1',
            breedtegraad: '51.18',
            lengtegraad: '-1.82',
            createdBy: 1,
            isPublic: true,
            site: {
              id: 1,
              naam: 'test naam 1',
              land: 'test land 1',
              beschrijving: 'test beschrijving 1',
              breedtegraad: '51',
              lengtegraad: '-1.5',
              hoogte: 100,
              foto: '/images/testimage1.jpg',
              createdBy: 1,
              isPublic: true,
            },
            wende: {
              id: 1,
              siteId: 1,
              wendeType: 'ZOMERZONNEWENDE',
              astronomischEvent: 'OPGANG',
              datumTijd: '2023-06-21T02:52:00.000Z',
              azimuthoek: '50',
              calculatedBy: 'PhotoEphemerisApp',
              createdBy: 1,
              isPublic: true,
            },
          },
          {
            id: 2,
            siteId: 1,
            wendeId: 2,
            naam: 'test marker 2',
            beschrijving: 'test marker beschrijving 2',
            breedtegraad: '53.7',
            lengtegraad: '-6.48',
            createdBy: 1,
            isPublic: true,
            site: {
              id: 1,
              naam: 'test naam 1',
              land: 'test land 1',
              beschrijving: 'test beschrijving 1',
              breedtegraad: '51',
              lengtegraad: '-1.5',
              hoogte: 100,
              foto: '/images/testimage1.jpg',
              createdBy: 1,
              isPublic: true,
            },
            wende: {
              id: 2,
              siteId: 1,
              wendeType: 'WINTERZONNEWENDE',
              astronomischEvent: 'OPGANG',
              datumTijd: '2023-12-22T07:09:00.000Z',
              azimuthoek: '128',
              calculatedBy: 'PhotoEphemerisApp',
              createdBy: 1,
              isPublic: true,
            },
          },
        ]),
      );
    });
  });

  describe('POST /api/markers', () => {
    const markersToDelete: number[] = [];

    beforeAll(async() => {
      await prisma.archeologischeSite.createMany({ data: data.archeosites });
      await prisma.wende.createMany({ data: data.wendes });
    });

    afterAll(async() => {
      await prisma.orientatieMarker.deleteMany({
        where: { id: { in: markersToDelete}},
      });
      await prisma.wende.deleteMany({
        where: { id: { in: dataToDelete.wendes } },
      });
      await prisma.archeologischeSite.deleteMany({
        where: { id: { in: dataToDelete.archeosites } },
      });
    });

    it('should 201 and return the created marker', async() => {
      const response = await request
        .post(url)
        .send({
          siteId: 1,
          wendeId: 1,
          naam: 'test marker',
          beschrijving: 'test marker beschrijving',
          breedtegraad: new Prisma.Decimal('51.2'),
          lengtegraad: new Prisma.Decimal('-1.8'),
        })
        .set('Authorization', authHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe('test marker');
      expect(response.body.beschrijving).toBe('test marker beschrijving');
      expect(response.body.breedtegraad).toBe('51.2');
      expect(response.body.lengtegraad).toBe('-1.8');
      expect(response.body.site).toEqual({
        id: 1,
        naam: 'test naam 1',
        land: 'test land 1',
        beschrijving: 'test beschrijving 1',
        breedtegraad: '51',
        lengtegraad: '-1.5',
        hoogte: 100,
        foto: '/images/testimage1.jpg',
        createdBy: 1,
        isPublic: true,
      });
    });
  });
});
