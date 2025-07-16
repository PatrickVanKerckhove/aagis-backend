// src/service/wende.ts
import ServiceError from '../core/serviceError';
import {prisma} from '../data';
import type { Wende, WendeCreateInput, WendeUpdateInput } from '../types/wende';
import handleDBError from './_handleDBError';

export const getAll = async ():Promise<Wende[]> =>{
  return prisma.wende.findMany();
};

export const getById = async (id: number):Promise<Wende> => {
  const wende = await prisma.wende.findUnique({
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
        },
      },
    },
  });
  if (!wende){
    throw ServiceError.notFound('Er is geen wende met dit id.');
  }
  return wende;
};

export const create = async (
  wende : WendeCreateInput) 
: Promise<Wende> =>{
  try{
    return await prisma.wende.create({
      data: wende,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number, 
  changes:WendeUpdateInput) 
: Promise<Wende> => {
  try{
    return await prisma.wende.update({
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
    await prisma.wende.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};
