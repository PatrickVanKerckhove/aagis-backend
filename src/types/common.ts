// src/types/common.ts
export interface Entity{
  id: number;
  createdBy: number | null;
  isPublic: boolean | null;
  // createdAt: Date;
  // updatedAt: Date;
}

export interface ListResponse<T> {
  items: T[];
}

export interface IdParams {
  id: number;
}
