import { config } from 'dotenv';

// Load environment variables
config();

export const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';