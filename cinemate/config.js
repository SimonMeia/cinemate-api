// Load environment variables from the .env file.
import * as dotenv from 'dotenv'
dotenv.config()

// Retrieve configuration from environment variables.
export const databaseUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1/cinemate';
export const port = process.env.PORT || '3000';
export const jwtSecret = process.env.JWT_SECRET || "changeme";
export const bcryptCostFactor = process.env.BCRYPT_COST_FACTOR || 10;
export const TMDB_API_KEY = process.env.TMDB_API_KEY