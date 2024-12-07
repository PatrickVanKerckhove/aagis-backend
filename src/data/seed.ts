// src/data/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed archeologischeSites
  // ==========
  await prisma.archeologischeSite.deleteMany({}); // eerst leegmaken

  await prisma.archeologischeSite.createMany({
    data: [
      {
        id: 1,
        naam: 'Stonehenge',
        land: 'Engeland',
        beschrijving: 'Prehistorisch monument in Wiltshire, Engeland, bekend om zijn astronomische uitlijningen.',
        breedtegraad: 51.178883,
        lengtegraad: -1.826204,
        hoogte: 101.0,
        foto: '/images/Stonehenge_800x600.jpg',
      },
      {
        id: 2,
        naam: 'Newgrange',
        land: 'Ierland',
        beschrijving: 'Neolithisch ganggraf in County Meath, Ierland, bekend om zijn winterzonnewende-uitlijning.',
        breedtegraad: 53.6947,
        lengtegraad: -6.4755,
        hoogte: 61.0,
        foto: '/images/Newgrange_800x600.jpg',
      },
      {
        id: 3,
        naam: 'Sint-Laurentiuskerk, Lokeren',
        land: 'België',
        beschrijving: 'Gelegen op het Kerkplein, oudste vermelding van een gebedshuis op deze plaats dateert van 1139.',
        breedtegraad: 51.10421,
        lengtegraad: 3.99201,
        hoogte: 6.0,
        foto: '/images/Lokeren_St-Laurentiuskerk_446x400.jpg',
      },
    ],
  });

  // Seed wendes
  // =================
  await prisma.wende.createMany({
    data: [
      {
        id: 1,
        siteId: 1, //Stonehenge
        wendeType: 'ZomerZonnewende',
        astronomischEvent: 'Opgang',
        datum: new Date('2023-06-21'),
        tijd: '04:52:00',
        azimuthoek: 51.3,
      },
      {
        id: 2,
        siteId: 1, //Stonehenge
        wendeType: 'WinterZonnewende',
        astronomischEvent: 'Opgang',
        datum: new Date('2023-12-22'),
        tijd: '08:09:00',
        azimuthoek: 128.05,
      },
      {
        id: 3,
        siteId: 2, //Newgrange
        wendeType: 'WinterZonnewende',
        astronomischEvent: 'Opgang',
        datum: new Date('2023-12-21'),
        tijd: '08:58:00',
        azimuthoek: 134.0,
      },
      {
        id: 4,
        siteId: 3, //Lokeren
        wendeType: 'ZomerZonnewende',
        astronomischEvent: 'Opgang',
        datum: new Date('2023-06-21'),
        tijd: '05:28:00',
        azimuthoek: 49.34,
      },
      {
        id: 5,
        siteId: 3, //Lokeren
        wendeType: 'WinterZonnewende',
        astronomischEvent: 'Opgang',
        datum: new Date('2023-12-22'),
        tijd: '08:45:00',
        azimuthoek: 127.97,
      },
      {
        id: 6,
        siteId: 3, //Lokeren
        wendeType: 'ZomerZonnewende',
        astronomischEvent: 'Ondergang',
        datum: new Date('2023-06-21'),
        tijd: '23:02:00',
        azimuthoek: 310.67,
      },
      {
        id: 7,
        siteId: 3, //Lokeren
        wendeType: 'WinterZonnewende',
        astronomischEvent: 'Ondergang',
        datum: new Date('2023-12-22'),
        tijd: '16:39:00',
        azimuthoek: 232.03,
      },
      {
        id: 8,
        siteId: 3, //Lokeren
        wendeType: 'ZuidKleineMaanwende',
        astronomischEvent: 'Opgang',
        datum: new Date('2015-10-18'),
        tijd: '13:17:00',
        azimuthoek: 119.88,
      },
      {
        id: 9,
        siteId: 3, //Lokeren
        wendeType: 'ZuidKleineMaanwende',
        astronomischEvent: 'Ondergang',
        datum: new Date('2015-10-18'),
        tijd: '22:22:00',
        azimuthoek: 240.06,
      },
      {
        id: 10,
        siteId: 3, //Lokeren
        wendeType: 'NoordKleineMaanwende',
        astronomischEvent: 'Opgang',
        datum: new Date('2015-10-31'),
        tijd: '20:55:00',
        azimuthoek: 60.48,
      },
      {
        id: 11,
        siteId: 3, //Lokeren
        wendeType: 'NoordKleineMaanwende',
        astronomischEvent: 'Ondergang',
        datum: new Date('2015-10-31'),
        tijd: '11:45:00',
        azimuthoek: 299.71,
      }, 
      {
        id: 12,
        siteId: 3, //Lokeren
        wendeType: 'NoordGroteMaanwende',
        astronomischEvent: 'Opgang',
        datum: new Date('2006-06-25'),
        tijd: '04:28:00',
        azimuthoek: 40.99,
      },
      {
        id: 13,
        siteId: 3, //Lokeren
        wendeType: 'NoordGroteMaanwende',
        astronomischEvent: 'Ondergang',
        datum: new Date('2006-06-25'),
        tijd: '22:43:00',
        azimuthoek: 318.69,
      },
      {
        id: 14,
        siteId: 3, //Lokeren
        wendeType: 'ZuidGroteMaanwende',
        astronomischEvent: 'Opgang',
        datum: new Date('2006-07-09'),
        tijd: '21:23:00',
        azimuthoek: 139.64,
      },
      {
        id: 15,
        siteId: 3, //Lokeren
        wendeType: 'ZuidGroteMaanwende',
        astronomischEvent: 'Ondergang',
        datum: new Date('2006-07-09'),
        tijd: '03:02:00',
        azimuthoek: 221.42,
      },
    ],
  });

  // Seed orientatieMarkers
  // ===========
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
        foto: '/images/Stonehenge_HeelStone_800x600.jpg',
      },
      { // Newgrange
        id: 2,
        siteId: 2,
        wendeId: 9,
        naam: 'Roof-box',
        beschrijving: 'Venster boven de ingang van het complex, in lijn met de zonsopgang tijdens de winterzonnewende.',
        breedtegraad: 53.694498,
        lengtegraad: -6.475209,
        foto: '/images/Newgrange_Roof-box_800x600.jpg',
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
