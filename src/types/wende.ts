// src/types/wende.ts
import type { Entity } from './common';
import type { ArcheologischeSite } from './archeosite';
import type { OrientatieMarker } from './marker';
import type { AstronomischEvent, WendeType } from '@prisma/client';

export interface Wende extends Entity{
  siteId: number;
  site?: ArcheologischeSite;
  wendeType: WendeType;
  astronomischEvent: AstronomischEvent;
  datum: Date;
  tijd: string;
  azimuthoek: number; // matches Decimal(6, 2)
  orientatieMarkers?: OrientatieMarker[];
}
