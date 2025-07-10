// src/types/user.ts
import type { Entity, ListResponse } from './common';

export interface User extends Entity{
  naam: string;
}

export interface UserCreateInput{
  naam: string;
}

export interface PublicUser extends Pick<User, 'id'|'naam'>{}

export interface UserUpdateInput extends UserCreateInput{}

export interface RegisterUserRequest{
  naam: string,
}
export interface UpdateUserRequest extends RegisterUserRequest {}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface UpdateUserResponse extends GetUserByIdResponse {}
