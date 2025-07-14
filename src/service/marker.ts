// src/service/marker.ts
import {prisma} from '../data';
import type { MarkerCreateInput, MarkerUpdateInput, OrientatieMarker } from '../types/marker';

export const getAll = async (): Promise<OrientatieMarker[]> => {
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
        },
      },
    },
  });
};

export const getById = async (id: number):Promise<OrientatieMarker> => {
  const marker = await prisma.orientatieMarker.findUnique({
    where: {
      id,
    },
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
    throw new Error('Er is geen marker met dit id.');
  }
  return marker;
};

export const create = async (
  marker : MarkerCreateInput) 
: Promise<OrientatieMarker> =>{
  return prisma.orientatieMarker.create({
    data: marker,
    include: {
      site: true,
    },
  });
};

export const updateById = async (
  id: number, 
  changes: MarkerUpdateInput)
: Promise<OrientatieMarker> => {
  return prisma.orientatieMarker.update({
    where: {
      id,
    },
    data: changes,
  });
};

export const deleteById = async (id: number) : Promise<void> => {
  await prisma.orientatieMarker.delete({
    where: {
      id,
    },
  });
};
