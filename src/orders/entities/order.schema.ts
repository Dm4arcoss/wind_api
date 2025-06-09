import { PrismaClient } from '@prisma/client';

export type Order = PrismaClient['order'];
export type CreateOrderInput = PrismaClient['order']['create'];
export type UpdateOrderInput = PrismaClient['order']['update'];
export type OrderWhereUniqueInput = PrismaClient['order']['findUnique'];
export type OrderWhereInput = PrismaClient['order']['findMany'];
export type OrderOrderByInput = PrismaClient['order']['orderBy'];
export type OrderInclude = PrismaClient['order']['include'];
export type OrderSelect = PrismaClient['order']['select'];
