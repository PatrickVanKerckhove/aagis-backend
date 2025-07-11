// src/types/health.ts
export interface PingResponse {
  pong: boolean;
}

export interface VersionResponse {
  env: string | undefined;
  version: string;
  name: string;
}
