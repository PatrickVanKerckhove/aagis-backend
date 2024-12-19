// src/service/archeosite.ts
import { prisma } from '../data';

export const getAll = async () =>{
  return prisma.archeologischeSite.findMany();
};

export const getById = async (id: number) => {
  const archeosite = await prisma.archeologischeSite.findUnique({
    where: {
      id,
    },
    include:{
      orientatieMarkers: {
        select: {
          id: true,
          wendeId: true,
          naam: true,
          beschrijving: true,
          breedtegraad: true,
          lengtegraad: true,
          foto: true,
        },
      },
      wendes: {
        select: {
          id: true,
          wendeType: true,
          astronomischEvent: true,
          datum: true,
          tijd: true,
          azimuthoek: true,
        },
      },
    },
  });
  if (!archeosite){
    throw new Error('Er is geen archeologische site met dit id.');
  }
  return archeosite;
};

export const create = async (
  {naam, land, beschrijving, breedtegraad, lengtegraad, hoogte, foto}:any,
) =>{
  return prisma.archeologischeSite.create({
    data: {
      naam,
      land,
      beschrijving,
      breedtegraad,
      lengtegraad,
      hoogte,
      foto,
    },
  });
};

export const updateById = async (
  id: number, 
  {naam, land, beschrijving, breedtegraad, lengtegraad, hoogte, foto}:any,
) => {
  return prisma.archeologischeSite.update({
    where: {
      id,
    },
    data: {
      naam,
      land,
      beschrijving,
      breedtegraad,
      lengtegraad,
      hoogte,
      foto,
    },
  });
};

export const deleteById = async (id: number) => {
  await prisma.archeologischeSite.delete({
    where: {
      id,
    },
  });
};

export const getMarkersBySiteId = (siteId: number) =>{
  return prisma.orientatieMarker.findMany({
    where: {
      siteId: siteId,
    },
  });
};

export const getWendesBySiteId = (siteId: number) =>{
  return prisma.wende.findMany({
    where: {
      siteId: siteId,
    },
  });
};
