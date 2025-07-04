// src/types/archeosite.ts
import type { Entity } from './common';

export interface ArcheologischeSite extends Entity{
  naam: string;
  land: string;
  beschrijving?: string | null;
  breedtegraad: number; // matches Decimal(10, 8)
  lengtegraad: number;  // matches Decimal(11, 8)
  hoogte?: number | null;      // matches Decimal(6, 2)
  foto?: string | null;
}
