// src/service/archeosite.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { 
  ArcheologischeSite, 
  ArcheoSiteCreateInput, 
  ArcheoSiteUpdateInput, 
  CreateArcheoSiteRequest } from '../types/archeosite';
import type { OrientatieMarker } from '../types/marker';
import type { Wende } from '../types/wende';
import handleDBError from './_handleDBError';

export const getAll = async (userId: number, isAdmin: boolean) : Promise<ArcheologischeSite[]> =>{
  if (isAdmin){
    return prisma.archeologischeSite.findMany({
      include: {
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
  }
  return prisma.archeologischeSite.findMany({
    where: {
      OR: [
        { createdBy: userId },
        { isPublic: true },
      ],
    },
    include: {
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
};

export const getById = async (id: number, userId: number, isAdmin: boolean) : Promise<ArcheologischeSite> => {
  const archeosite = await prisma.archeologischeSite.findUnique({
    where: { id },
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
  if (isAdmin || archeosite.createdBy === userId || archeosite.isPublic) {
    return archeosite;
  }
  throw ServiceError.forbidden('Je hebt geen toegang tot deze archeologische site.');
};

export const create = async (
  data : CreateArcheoSiteRequest, userId: number) 
: Promise<ArcheologischeSite> =>{
  try{
    const createData: ArcheoSiteCreateInput = {
      ...data,
      createdBy: userId,
      isPublic: false, // Standaard false
    };
    return await prisma.archeologischeSite.create({
      data: createData,
      include: {
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
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number, 
  changes : ArcheoSiteUpdateInput,
  userId: number,
  isAdmin: boolean) 
: Promise<ArcheologischeSite> => {
  try{
    const archeosite = await prisma.archeologischeSite.findUnique({ where: { id } });
    if (!archeosite) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && archeosite.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze archeologische site te wijzigen.');
    }
    if (changes.isPublic !== undefined && !isAdmin) {
      throw ServiceError.forbidden('Alleen admins kunnen isPublic wijzigen.');
    }
    return await prisma.archeologischeSite.update({
      where: { id },
      data: changes,
      include: {
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
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, userId: number, isAdmin: boolean) : Promise<void> => {
  try{
    const archeosite = await prisma.archeologischeSite.findUnique({ where: { id } });
    if (!archeosite) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && archeosite.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze archeologische site te verwijderen.');
    }
    await prisma.archeologischeSite.delete({
      where: { id },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const getMarkersBySiteId = async (
  siteId: number,
  userId: number,
  isAdmin: boolean,
): Promise<OrientatieMarker[]> =>{
  try {
    const site = await prisma.archeologischeSite.findUnique({ where: { id: siteId } });
    if (!site) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && site.createdBy !== userId && !site.isPublic) {
      throw ServiceError.forbidden('Je hebt geen toegang tot deze archeologische site.');
    }
    return prisma.orientatieMarker.findMany({
      where: { siteId },
      include: {
        site: true,
        wende: {
          select: {
            id: true,
            siteId: true,
            wendeType: true,
            astronomischEvent: true,
            datumTijd: true,
            azimuthoek: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const getWendesBySiteId = async (
  siteId: number,
  userId: number,
  isAdmin: boolean,
): Promise<Wende[]> =>{
  try {
    const site = await prisma.archeologischeSite.findUnique({ where: { id: siteId } });
    if (!site) {
      throw ServiceError.notFound('Er is geen archeologische site met dit id.');
    }
    if (!isAdmin && site.createdBy !== userId && !site.isPublic) {
      throw ServiceError.forbidden('Je hebt geen toegang tot deze archeologische site.');
    }
    return prisma.wende.findMany({
      where: { siteId },
      include: {
        site: true,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};
