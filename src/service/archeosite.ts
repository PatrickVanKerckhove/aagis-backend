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
  archeoSite : ArcheoSiteCreateInput) 
: Promise<ArcheologischeSite> =>{
  return prisma.archeologischeSite.create({
    data: archeoSite,
  });
};

export const updateById = async (
  id: number, 
  changes : ArcheoSiteUpdateInput) 
: Promise<ArcheologischeSite> => {
  return prisma.archeologischeSite.update({
    where: {
      id,
    },
    data: changes,
  });
};

export const deleteById = async (id: number) : Promise<void> => {
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
