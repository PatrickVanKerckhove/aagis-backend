// src/types/user.ts
import type { Prisma } from '@prisma/client';
import type { ListResponse } from './common';

export interface User {
  id: number;
  naam: string;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
}

export interface PublicUser extends Pick<User, 'id' | 'naam' | 'email' > {}

export interface UserCreateInput{
  naam: string;
  email: string;
  password: string;
}

export interface UserUpdateInput extends Pick<UserCreateInput, 'naam' | 'email' > {}

export interface LoginRequest{
  email: string;
  password: string;
}

export interface LoginResponse{
  token: string;
}

export interface GetUserRequest {
  id: number | 'me';
}

export interface CreateUserRequest {
  naam: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest extends Pick<CreateUserRequest, 'naam' | 'email' > {}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface CreateUserResponse extends GetUserByIdResponse {}
export interface UpdateUserResponse extends GetUserByIdResponse {}
