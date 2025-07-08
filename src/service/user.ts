// src/service/user.ts
import { prisma } from '../data';

export const getAll = async () => {
  return prisma.user.findMany(); 
};

export const getById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where:{
      id,
    },
  });
  if (!user){
    throw new Error('Er is geen user met dit id.');
  }
  return user;
};

export const create = async (
  {naam}:any,
) =>{
  return prisma.user.create({
    data: {
      naam,
    },
  });
};

export const updateById = async (
  id:number, 
  {naam}:any,
) => {
  return prisma.user.update({
    where: {
      id,
    },
    data:{
      naam,
    },
  });
};

export const deleteById = async (id: number) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
