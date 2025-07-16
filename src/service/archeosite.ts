// src/service/archeosite.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { ArcheologischeSite, ArcheoSiteCreateInput, ArcheoSiteUpdateInput } from '../types/archeosite';
import handleDBError from './_handleDBError';

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
    throw ServiceError.notFound('Er is geen archeologische site met dit id.');
  }
  return archeosite;
};

export const create = async (
  archeoSite : ArcheoSiteCreateInput) 
: Promise<ArcheologischeSite> =>{
  try{
    return await prisma.archeologischeSite.create({
      data: archeoSite,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number, 
  changes : ArcheoSiteUpdateInput) 
: Promise<ArcheologischeSite> => {
  try{
    return await prisma.archeologischeSite.update({
      where: {
        id,
      },
      data: changes,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number) : Promise<void> => {
  try{
    await prisma.archeologischeSite.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
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
