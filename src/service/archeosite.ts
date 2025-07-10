// src/service/archeosite.ts
import { prisma } from '../data';
import type { ArcheologischeSite, ArcheoSiteCreateInput, ArcheoSiteUpdateInput } from '../types/archeosite';

export const getAll = async () : Promise<ArcheologischeSite[]> =>{
  return prisma.archeologischeSite.findMany();
};

export const getById = async (id: number) : Promise<ArcheologischeSite> => {
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
        },
      },
      wendes: {
        select: {
          id: true,
          wendeType: true,
          astronomischEvent: true,
          datumTijd: true,
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
  {naam, land, beschrijving, breedtegraad, lengtegraad, hoogte, foto} : ArcheoSiteCreateInput) 
: Promise<ArcheologischeSite> =>{
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
  id: number, {naam, land, beschrijving, breedtegraad, lengtegraad, hoogte, foto} : ArcheoSiteUpdateInput) 
: Promise<ArcheologischeSite> => {
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

export const deleteById = async (id: number) : Promise<void> => {
  await prisma.archeologischeSite.delete({
    where: {
      id,
    },
  });
};
