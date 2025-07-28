// src/service/marker.ts
import ServiceError from '../core/serviceError';
import {prisma} from '../data';
import type { MarkerCreateInput, 
  MarkerUpdateInput, 
  CreateMarkerRequest,
  OrientatieMarker } from '../types/marker';
import handleDBError from './_handleDBError';

export const getAll = async (userId: number, isAdmin: boolean): Promise<OrientatieMarker[]> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ServiceError.notFound('Gebruiker niet gevonden.');
  }
  if (isAdmin) {
    return prisma.orientatieMarker.findMany({
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
            calculatedBy: true,
            createdBy: true,
            isPublic: true,
          },
        },
      },
    });
  }
  return prisma.orientatieMarker.findMany({
    where: {
      OR: [
        { createdBy: userId },
        { isPublic: true },
      ],
    },
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
          calculatedBy: true,
          createdBy: true,
          isPublic: true,
        },
      },
    },
  });
};

export const getById = async (id: number, userId: number, isAdmin: boolean):Promise<OrientatieMarker> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ServiceError.notFound('Gebruiker niet gevonden.');
  }
  const marker = await prisma.orientatieMarker.findUnique({
    where: { id },
    include:{
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
  if (!marker){
    throw ServiceError.notFound('Er is geen marker met dit id.');
  }
  if (isAdmin || marker.createdBy === userId || marker.isPublic) {
    return marker;
  }
  throw ServiceError.forbidden('Je hebt geen toegang tot deze marker.');
};

export const create = async (
  data: CreateMarkerRequest, userId: number) 
: Promise<OrientatieMarker> =>{
  try{
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const createData: MarkerCreateInput = {
      ...data,
      createdBy: userId,
      isPublic: false, // Standaard false
    };
    return await prisma.orientatieMarker.create({
      data: createData,
      include: {
        site: true,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number, 
  changes: MarkerUpdateInput,
  userId: number,
  isAdmin: boolean,
) : Promise<OrientatieMarker> => {
  try{
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const marker = await prisma.orientatieMarker.findUnique({ where: { id } });
    if (!marker) {
      throw ServiceError.notFound('Er is geen marker met dit id.');
    }
    if (!isAdmin && marker.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze marker te wijzigen.');
    }
    if (changes.isPublic !== undefined && !isAdmin) {
      throw ServiceError.forbidden('Alleen admins kunnen isPublic wijzigen.');
    }
    return await prisma.orientatieMarker.update({
      where: { id },
      data: changes,
      include: {
        site: true,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, userId: number, isAdmin: boolean): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ServiceError.notFound('Gebruiker niet gevonden.');
    }
    const marker = await prisma.orientatieMarker.findUnique({ where: { id } });
    if (!marker) {
      throw ServiceError.notFound('Er is geen marker met dit id.');
    }
    if (!isAdmin && marker.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze marker te verwijderen.');
    }
    await prisma.orientatieMarker.delete({
      where: { id },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};
