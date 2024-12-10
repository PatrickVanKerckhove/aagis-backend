// src/service/archeosite.ts
import ARCHEOLOGISCHESITE_DATA from '../data/mock_sites';
import ORIENTATIEMARKERS_DATA from '../data/mock_markers';
import { prisma } from '../data';

export const getAll = async () =>{
  return prisma.archeologischeSite.findMany();
};

export const getById = async (id: number) => {
  return prisma.archeologischeSite.findUnique({
    where: {
      id,
    },
    include:{
      orientatieMarkers: {
        select: {
          id: true,
          naam: true,
          beschrijving: true,
          breedtegraad: true,
          lengtegraad: true,
          foto: true,
        },
      },
    },
  });
};

export const create = (
  {naam, land, beschrijving, breedtegraad, lengtegraad, hoogte, foto, geselecteerd}:any,
) =>{
  const maxId = Math.max(...ARCHEOLOGISCHESITE_DATA.map((i) => i.id));
  const newArcheosite = {
    id: maxId + 1,
    naam,
    land,
    beschrijving,
    breedtegraad,
    lengtegraad,
    hoogte,
    foto,
    geselecteerd,
  };
  ARCHEOLOGISCHESITE_DATA.push(newArcheosite);
  return newArcheosite;
};

export const updateById = (
  id: number, 
  {siteId, naam, land, beschrijving, breedtegraad, lengtegraad, hoogte, foto}:any,
) => {
  throw new Error('Not implemented yet');
};

export const deleteById = (id: number) => {
  throw new Error('Not implemented yet');
};

export const getMarkersBySiteId = (siteId: number) =>{
  return ORIENTATIEMARKERS_DATA.filter((m)=>m.siteId === siteId);
};
