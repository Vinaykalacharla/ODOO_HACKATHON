import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET'
];

export function validateEnv() {
  const missing = requiredEnv.filter(env => !process.env[env]);
  if (missing.length > 0) {
    throw new Error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  }
  console.log('✅ Environment variables validated.');
}
