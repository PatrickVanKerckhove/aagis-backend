// src/service/wende.ts
import {prisma} from '../data';

export const getAll = async () =>{
  return prisma.wende.findMany();
};

export const getById = async (id: number) => {
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
  {siteId, wendeType, astronomischEvent, datumTijd, azimuthoek}:any,
) =>{
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
  {siteId, wendeType, astronomischEvent, datumTijd, azimuthoek}:any,
) => {
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

export const deleteById = async (id: number) => {
  await prisma.wende.delete({
    where: {
      id,
    },
  });
};
