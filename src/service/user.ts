// src/service/user.ts
import { prisma } from '../data';
import type { User, UserCreateInput, UserUpdateInput } from '../types/user';

export const getAll = async () : Promise<User[]> => {
  return prisma.user.findMany(); 
};

export const getById = async (id: number) : Promise<User> => {
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

export const create = async ({naam}:UserCreateInput) : Promise<User> =>{
  return prisma.user.create({
    data: {
      naam,
    },
  });
};

export const updateById = async (id:number, {naam}:UserUpdateInput): Promise<User> => {
  return prisma.user.update({
    where: {
      id,
    },
    data:{
      naam,
    },
  });
};

export const deleteById = async (id: number) : Promise<void> => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
