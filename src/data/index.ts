// src/data/index.ts
import { PrismaClient } from '@prisma/client';
import { getLogger } from '../core/logging';

// Singleton
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
}); 

export async function initializeData(): Promise<void> {
  getLogger().info('Initializing connection to the database');

  await prisma.$connect();

  getLogger().info('Successfully connected to the database');
}

export async function shutdownData(): Promise<void> {
  getLogger().info('Shutting down database connection');

  await prisma?.$disconnect();

  getLogger().info('Database connection closed');
}
