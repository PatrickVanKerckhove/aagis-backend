// src/types/archeosite.ts
import type { Decimal } from '@prisma/client/runtime/library';
import type { Entity, ListResponse } from './common';

export interface ArcheologischeSite extends Entity{
  naam: string;
  land: string;
  beschrijving: string | null;
  breedtegraad: Decimal; // matches Decimal(10, 8)
  lengtegraad: Decimal;  // matches Decimal(11, 8)
  hoogte: number | null;
  foto: string | null;
  createdBy: number;
  isPublic: boolean;
}
export interface CreateArcheoSiteRequest{
  naam: string;
  land: string;
  beschrijving: string | null;
  breedtegraad: Decimal; // matches Decimal(10, 8)
  lengtegraad: Decimal;  // matches Decimal(11, 8)
  hoogte: number | null;
  foto: string | null;
}

export interface ArcheoSiteCreateInput extends CreateArcheoSiteRequest{
  createdBy: number;
  isPublic?: boolean;
}

export interface ArcheoSiteUpdateInput extends Partial<CreateArcheoSiteRequest> {
  isPublic?: boolean;
}

export interface UpdateArcheoSiteRequest extends ArcheoSiteUpdateInput{}

export interface GetAllArcheoSitesResponse extends ListResponse<ArcheologischeSite>{}
export interface GetArcheoSiteByIdResponse extends ArcheologischeSite {}
export interface CreateArcheoSiteResponse extends GetArcheoSiteByIdResponse{}
export interface UpdateArcheoSiteResponse extends GetArcheoSiteByIdResponse{}
