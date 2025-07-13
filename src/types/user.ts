// src/types/user.ts
import type { Entity, ListResponse } from './common';

export interface User extends Entity{
  naam: string;
}

export interface UserCreateInput{
  naam: string;
}

export interface UserUpdateInput extends UserCreateInput{}

export interface CreateUserRequest {
  naam: string;
}

export interface UpdateUserRequest extends CreateUserRequest {}

export interface GetAllUsersResponse extends ListResponse<User> {}
export interface GetUserByIdResponse extends User {}
export interface CreateUserResponse extends GetUserByIdResponse {}
export interface UpdateUserResponse extends GetUserByIdResponse {}
