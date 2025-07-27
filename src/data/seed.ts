// src/data/seed.ts
import { PrismaClient, WendeType, AstronomischEvent} from '@prisma/client';
import { hashPassword } from '../core/password';
import Role from '../core/roles';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const passwordHash = await hashPassword('12345678');
  await prisma.user.createMany({
    data: [
      { 
        id: 1,
        naam: 'admin',
        email: 'admin@aagis.be',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: 2,
        naam: 'user',
        email: 'user@aagis.be',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
      {
        id: 3,
        naam: 'user2',
        email: 'user2@aagis.be',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
    ],
  });
  
  // Seed archeologischeSites
  await prisma.archeologischeSite.createMany({
    data: [
      {
        id: 1,
        naam: 'Stonehenge',
        land: 'Engeland',
        beschrijving: 'Prehistorisch monument in Wiltshire, Engeland, bekend om zijn astronomische uitlijningen.',
        breedtegraad: 51.178883,
        lengtegraad: -1.826204,
        hoogte: 101,
        foto: '/images/Stonehenge_800x600.jpg',
        createdBy: 1,
        isPublic: true,
      },
      {
        id: 2,
        naam: 'Newgrange',
        land: 'Ierland',
        beschrijving: 'Neolithisch ganggraf in County Meath, Ierland, bekend om zijn winterzonnewende-uitlijning.',
        breedtegraad: 53.6947,
        lengtegraad: -6.4755,
        hoogte: 61,
        foto: '/images/Newgrange_800x600.jpg',
        createdBy: 1,
        isPublic: true,
      },
      {
        id: 3,
        naam: 'Sint-Laurentiuskerk, Lokeren',
        land: 'België',
        beschrijving: 'Gelegen op het Kerkplein, oudste vermelding van een gebedshuis op deze plaats dateert van 1139.',
        breedtegraad: 51.10421,
        lengtegraad: 3.99201,
        hoogte: 6,
        foto: '/images/Lokeren_St-Laurentiuskerk_446x400.jpg',
        createdBy: 2,
        isPublic: false,
      },
    ],
  });

  // Seed wendes
  await prisma.wende.createMany({
    data: [
      {
        id: 1,
        siteId: 1, //Stonehenge
        wendeType: WendeType.ZOMERZONNEWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2023, 5, 21, 4, 52), // maand 5 = juni
        azimuthoek: 51.3,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 1,
        isPublic: true,

      },
      {
        id: 2,
        siteId: 1, //Stonehenge
        wendeType: WendeType.WINTERZONNEWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2023, 11, 22, 8, 9),
        azimuthoek: 128.05,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 1,
        isPublic: true,
      },
      {
        id: 3,
        siteId: 2, //Newgrange
        wendeType: WendeType.WINTERZONNEWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2023, 11, 21, 8, 58),
        azimuthoek: 134.0,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 1,
        isPublic: true,
      },
      {
        id: 4,
        siteId: 3, //Lokeren
        wendeType: WendeType.ZOMERZONNEWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2023, 5, 21, 5, 28),
        azimuthoek: 49.34,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 5,
        siteId: 3, //Lokeren
        wendeType: WendeType.WINTERZONNEWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2023, 11, 22, 8, 45),
        azimuthoek: 127.97,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 6,
        siteId: 3, //Lokeren
        wendeType: WendeType.ZOMERZONNEWENDE,
        astronomischEvent: AstronomischEvent.ONDERGANG,
        datumTijd: new Date(2023, 5, 21, 23, 2),
        azimuthoek: 310.67,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 7,
        siteId: 3, //Lokeren
        wendeType: WendeType.WINTERZONNEWENDE,
        astronomischEvent: AstronomischEvent.ONDERGANG,
        datumTijd: new Date(2023, 11, 22, 16, 39),
        azimuthoek: 232.03,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 8,
        siteId: 3, //Lokeren
        wendeType: WendeType.ZUIDKLEINEMAANWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2015, 9, 18, 13, 17),
        azimuthoek: 119.88,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 9,
        siteId: 3, //Lokeren
        wendeType: WendeType.ZUIDKLEINEMAANWENDE,
        astronomischEvent: AstronomischEvent.ONDERGANG,
        datumTijd: new Date(2015, 9, 18, 22, 22),
        azimuthoek: 240.06,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 10,
        siteId: 3, //Lokeren
        wendeType: WendeType.NOORDKLEINEMAANWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2015, 9, 31, 20, 55),
        azimuthoek: 60.48,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 11,
        siteId: 3, //Lokeren
        wendeType: WendeType.NOORDKLEINEMAANWENDE,
        astronomischEvent: AstronomischEvent.ONDERGANG,
        datumTijd: new Date(2015, 9, 31, 11, 45),
        azimuthoek: 299.71,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      }, 
      {
        id: 12,
        siteId: 3, //Lokeren
        wendeType: WendeType.NOORDGROTEMAANWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2006, 5, 25, 4, 28),
        azimuthoek: 40.99,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 13,
        siteId: 3, //Lokeren
        wendeType: WendeType.NOORDGROTEMAANWENDE,
        astronomischEvent: AstronomischEvent.ONDERGANG,
        datumTijd: new Date(2006, 5, 25, 22, 43),
        azimuthoek: 318.69,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 14,
        siteId: 3, //Lokeren
        wendeType: WendeType.ZUIDGROTEMAANWENDE,
        astronomischEvent: AstronomischEvent.OPGANG,
        datumTijd: new Date(2006, 6, 9, 21, 23),
        azimuthoek: 139.64,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
      {
        id: 15,
        siteId: 3, //Lokeren
        wendeType: WendeType.ZUIDGROTEMAANWENDE,
        astronomischEvent: AstronomischEvent.ONDERGANG,
        datumTijd: new Date(2006, 6, 9, 3, 2),
        azimuthoek: 221.42,
        calculatedBy: 'PhotoEphemerisApp',
        createdBy: 2,
        isPublic: false,
      },
    ],
  });

  // Seed orientatieMarkers
  await prisma.orientatieMarker.createMany({
    data: [
      { //Stonehenge
        id: 1,
        siteId: 1,
        wendeId: 1,
        naam: 'Heel Stone',
        beschrijving: 'Megaliet in lijn met de zonsopgang tijdens de zomerzonnewende.',
        breedtegraad: 51.179085,
        lengtegraad: -1.825797,
        createdBy: 1,
        isPublic: true,
      },
      { // Newgrange
        id: 2,
        siteId: 2,
        wendeId: 3,
        naam: 'Roof-box',
        beschrijving: 'Venster boven de ingang van het complex, in lijn met de zonsopgang tijdens de winterzonnewende.',
        breedtegraad: 53.694498,
        lengtegraad: -6.475209,
        createdBy: 1,
        isPublic: true,
      },
    ],
  }); 
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
