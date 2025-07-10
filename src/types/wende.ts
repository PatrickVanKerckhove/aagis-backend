// src/types/wende.ts
import type { Entity } from './common';
import type { Decimal } from '@prisma/client/runtime/library';
import type { AstronomischEvent, WendeType } from '@prisma/client';

export interface Wende extends Entity{
  siteId: number;
  wendeType: WendeType;
  astronomischEvent: AstronomischEvent;
  datumTijd: Date;
  azimuthoek: Decimal;
}

export interface WendeCreateInput{
  siteId: number;
  wendeType: WendeType;
  astronomischEvent: AstronomischEvent;
  datumTijd: Date;
  azimuthoek: Decimal;
}

export interface WendeUpdateInput extends WendeCreateInput{}
