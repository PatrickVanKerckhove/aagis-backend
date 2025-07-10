// src/service/marker.ts
import {prisma} from '../data';
import type { MarkerCreateInput, MarkerUpdateInput, OrientatieMarker } from '../types/marker';

export const getAll = async ():Promise<OrientatieMarker[]> =>{
  return prisma.orientatieMarker.findMany();
};

export const getById = async (id: number):Promise<OrientatieMarker> => {
  const marker = await prisma.orientatieMarker.findUnique({
    where: {
      id,
    },
    include:{
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
    throw new Error('Er is geen marker met dit id.');
  }
  return marker;
};

export const create = async (
  {siteId, wendeId, naam, beschrijving, breedtegraad, lengtegraad} : MarkerCreateInput) 
: Promise<OrientatieMarker> =>{
  return prisma.orientatieMarker.create({
    data: {
      siteId, 
      wendeId, 
      naam, 
      beschrijving,
      breedtegraad, 
      lengtegraad, 
    },
  });
};

export const updateById = async (
  id: number, {siteId, wendeId, naam, beschrijving, breedtegraad, lengtegraad}: MarkerUpdateInput)
: Promise<OrientatieMarker> => {
  return prisma.orientatieMarker.update({
    where: {
      id,
    },
    data: {
      siteId, 
      wendeId, 
      naam, 
      beschrijving, 
      breedtegraad, 
      lengtegraad, 
    },
  });
};

export const deleteById = async (id: number) : Promise<void> => {
  await prisma.orientatieMarker.delete({
    where: {
      id,
    },
  });
};
