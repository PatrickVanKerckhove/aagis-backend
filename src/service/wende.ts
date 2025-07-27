// src/service/wende.ts
import ServiceError from '../core/serviceError';
import {prisma} from '../data';
import type { 
  Wende, 
  WendeCreateInput, 
  WendeUpdateInput,
  CreateWendeRequest } from '../types/wende';
import handleDBError from './_handleDBError';

export const getAll = async (
  userId: number, isAdmin: boolean,
):Promise<Wende[]> =>{
  if (isAdmin) {
    return prisma.wende.findMany({
      include: {
        site: true,
      },
    });
  }
  return prisma.wende.findMany({
    where: {
      OR: [
        { createdBy: userId },
        { isPublic: true },
      ],
    },
    include: {
      site: true,
    },
  });
};

export const getById = async (
  id: number, userId: number, isAdmin: boolean,
):Promise<Wende> => {
  const wende = await prisma.wende.findUnique({
    where: { id },
    include:{
      orientatieMarkers: {
        select: {
          id: true,
          naam: true,
          beschrijving: true,
          breedtegraad: true,
          lengtegraad: true,
        },
      },
    },
  });
  if (!wende){
    throw ServiceError.notFound('Er is geen wende met dit id.');
  }
  if (isAdmin || wende.createdBy === userId || wende.isPublic) {
    return wende;
  }
  throw ServiceError.forbidden('Je hebt geen toegang tot deze wende.');
};

export const create = async (
  data: CreateWendeRequest, userId: number,
) : Promise<Wende> =>{
  try{
    const createData: WendeCreateInput = {
      ...data,
      createdBy: userId,
      isPublic: false, // Standaard false
    };
    return await prisma.wende.create({
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
  changes:WendeUpdateInput,
  userId: number,
  isAdmin: boolean,
) : Promise<Wende> => {
  try{
    const wende = await prisma.wende.findUnique({ where: { id } });
    if (!wende) {
      throw ServiceError.notFound('Er is geen wende met dit id.');
    }
    if (!isAdmin && wende.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze wende te wijzigen.');
    }
    if (changes.isPublic !== undefined && !isAdmin) {
      throw ServiceError.forbidden('Alleen admins kunnen isPublic wijzigen.');
    }
    return await prisma.wende.update({
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

export const deleteById = async (
  id: number,
  userId: number, 
  isAdmin: boolean,
) : Promise<void> => {
  try{
    const wende = await prisma.wende.findUnique({ where: { id } });
    if (!wende) {
      throw ServiceError.notFound('Er is geen wende met dit id.');
    }
    if (!isAdmin && wende.createdBy !== userId) {
      throw ServiceError.forbidden('Je hebt geen rechten om deze wende te verwijderen.');
    }
    await prisma.wende.delete({
      where: { id },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};
