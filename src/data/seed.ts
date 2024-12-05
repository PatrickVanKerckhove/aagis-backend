// src/data/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed archeologischeSites
  // ==========
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

  // Seed wendes
  // =================
  await prisma.wende.createMany({
    data: [
      {
        id: 1,
        siteId: 1, //Stonehenge
        wendeType: 'zomerZonnewende',
        astronomischEvent: 'opgang',
        datum: '2023-06-21',
        tijd: '04:52:00',
        azimuthoek: 51.3,
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
