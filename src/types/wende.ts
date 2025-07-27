// src/types/wende.ts
import type { Entity, ListResponse } from './common';
import type { Decimal } from '@prisma/client/runtime/library';
import type { AstronomischEvent, WendeType } from '@prisma/client';

export interface Wende extends Entity{
  siteId: number;
  wendeType: WendeType;
  astronomischEvent: AstronomischEvent;
  datumTijd: Date;
  azimuthoek: Decimal;
  calculatedBy: string;
  createdBy: number;
  isPublic: boolean;
}

export interface CreateWendeRequest{
  siteId: number;
  wendeType: WendeType;
  astronomischEvent: AstronomischEvent;
  datumTijd: Date;
  azimuthoek: Decimal;
  calculatedBy: string;
}

export interface WendeCreateInput extends CreateWendeRequest{
  createdBy: number;
  isPublic?: boolean;
}

export interface WendeUpdateInput extends Partial<CreateWendeRequest>{
  isPublic?: boolean;
}

export interface UpdateWendeRequest extends WendeUpdateInput{}

export interface GetAllWendesResponse extends ListResponse<Wende>{}
export interface GetWendeByIdResponse extends Wende {}
export interface CreateWendeResponse extends GetWendeByIdResponse{}
export interface UpdateWendeResponse extends GetWendeByIdResponse{}
