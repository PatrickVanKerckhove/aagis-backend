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
}

export interface MarkerCreateInput{
  siteId: number;
  wendeId: number | null;
  naam: string;
  beschrijving: string | null;
  breedtegraad: Decimal;
  lengtegraad: Decimal;
}

export interface MarkerUpdateInput extends MarkerCreateInput{}

export interface CreateMarkerRequest extends MarkerCreateInput{}
export interface UpdateMarkerRequest extends MarkerCreateInput{}

export interface GetAllMarkersResponse extends ListResponse<OrientatieMarker>{}
export interface GetMarkerByIdResponse extends OrientatieMarker {}
export interface CreateMarkerResponse extends GetMarkerByIdResponse{}
export interface UpdateMarkerResponse extends GetMarkerByIdResponse{}
