// src/service/marker.ts
import ServiceError from '../core/serviceError';
import {prisma} from '../data';
import type { MarkerCreateInput, MarkerUpdateInput, OrientatieMarker } from '../types/marker';
import handleDBError from './_handleDBError';

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
    throw ServiceError.notFound('Er is geen marker met dit id.');
  }
  return marker;
};

export const create = async (
  marker : MarkerCreateInput) 
: Promise<OrientatieMarker> =>{
  try{
    return await prisma.orientatieMarker.create({
      data: marker,
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
  changes: MarkerUpdateInput)
: Promise<OrientatieMarker> => {
  try{
    return await prisma.orientatieMarker.update({
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
    await prisma.orientatieMarker.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};
