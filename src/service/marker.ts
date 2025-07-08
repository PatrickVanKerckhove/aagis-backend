// src/service/marker.ts
import {prisma} from '../data';

export const getAll = async () =>{
  return prisma.orientatieMarker.findMany();
};

export const getById = async (id: number) => {
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
  {siteId, wendeId, naam, beschrijving, breedtegraad, lengtegraad}:any,
) =>{
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
  id: number, 
  {siteId, wendeId, naam, beschrijving, breedtegraad, lengtegraad}:any,
) => {
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

export const deleteById = async (id: number) => {
  await prisma.orientatieMarker.delete({
    where: {
      id,
    },
  });
};
