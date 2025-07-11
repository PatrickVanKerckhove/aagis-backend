// src/types/archeosite.ts
import type { Decimal } from '@prisma/client/runtime/library';
import type { Entity, ListResponse } from './common';

export interface ArcheologischeSite extends Entity{
  naam: string;
  land: string;
  beschrijving: string | null;
  breedtegraad: Decimal; // matches Decimal(10, 8)
  lengtegraad: Decimal;  // matches Decimal(11, 8)
  hoogte: Decimal | null;      // matches Decimal(6, 2)
  foto: string | null;
}
export interface ArcheoSiteCreateInput{
  naam: string;
  land: string;
  beschrijving: string | null;
  breedtegraad: Decimal; // matches Decimal(10, 8)
  lengtegraad: Decimal;  // matches Decimal(11, 8)
  hoogte: Decimal | null;      // matches Decimal(6, 2)
  foto: string | null;
}

export interface ArcheoSiteUpdateInput extends ArcheoSiteCreateInput{}

export interface CreateArcheoSiteRequest extends ArcheoSiteCreateInput{}
export interface UpdateArcheoSiteRequest extends ArcheoSiteCreateInput{}

export interface GetAllArcheoSitesResponse extends ListResponse<ArcheologischeSite>{}
export interface GetArcheoSiteByIdResponse extends ArcheologischeSite {}
export interface CreateArcheoSiteResponse extends GetArcheoSiteByIdResponse{}
export interface UpdateArcheoSiteResponse extends GetArcheoSiteByIdResponse{}
