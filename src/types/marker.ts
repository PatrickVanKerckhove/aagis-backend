// src/types/marker.ts
import type { Entity } from './common';
import type { ArcheologischeSite } from './archeosite';
import type { Wende } from './wende';

export interface OrientatieMarker extends Entity{
  siteId: number;
  site?: ArcheologischeSite; // Optional to avoid circular dependencies
  wendeId?: number | null;
  wende?: Wende;
  naam: string;
  beschrijving?: string | null;
  breedtegraad: number; // matches Decimal(10, 8)
  lengtegraad: number;  // matches Decimal(11, 8)
}
