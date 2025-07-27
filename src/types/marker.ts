// src/types/marker.ts
import type { ArcheologischeSite } from './archeosite';
import type { Entity, ListResponse } from './common';
import type { Decimal } from '@prisma/client/runtime/library';

export interface OrientatieMarker extends Entity{
  siteId: number;
  wendeId: number | null;
  naam: string;
  beschrijving: string | null;
  breedtegraad: Decimal;
  lengtegraad: Decimal;
  site?: ArcheologischeSite;
  createdBy: number;
  isPublic: boolean;
}

export interface CreateMarkerRequest{
  siteId: number;
  wendeId: number | null;
  naam: string;
  beschrijving: string | null;
  breedtegraad: Decimal;
  lengtegraad: Decimal;
}

export interface MarkerCreateInput extends CreateMarkerRequest {
  createdBy: number;
  isPublic?: boolean;
}

export interface MarkerUpdateInput extends Partial<CreateMarkerRequest> {
  isPublic?: boolean;
}

export interface UpdateMarkerRequest extends MarkerUpdateInput{}

export interface GetAllMarkersResponse extends ListResponse<OrientatieMarker>{}
export interface GetMarkerByIdResponse extends OrientatieMarker {}
export interface CreateMarkerResponse extends GetMarkerByIdResponse{}
export interface UpdateMarkerResponse extends GetMarkerByIdResponse{}
