// src/service/wende.ts
import {prisma} from '../data';
import type { Wende, WendeCreateInput, WendeUpdateInput } from '../types/wende';

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
    throw new Error('Er is geen wende met dit id.');
  }
  return wende;
};

export const create = async (
  {siteId, wendeType, astronomischEvent, datumTijd, azimuthoek} : WendeCreateInput) 
: Promise<Wende> =>{
  return prisma.wende.create({
    data: {
      siteId, 
      wendeType, 
      astronomischEvent, 
      datumTijd, 
      azimuthoek,
    },
  });
};

export const updateById = async (
  id: number, 
  {siteId, wendeType, astronomischEvent, datumTijd, azimuthoek}:WendeUpdateInput) 
: Promise<Wende> => {
  return prisma.wende.update({
    where: {
      id,
    },
    data: {
      siteId, 
      wendeType, 
      astronomischEvent, 
      datumTijd, 
      azimuthoek,
    },
  });
};

export const deleteById = async (id: number) : Promise<void> => {
  await prisma.wende.delete({
    where: {
      id,
    },
  });
};
