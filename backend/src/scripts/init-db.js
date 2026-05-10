import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const schemaPath = path.join(__dirname, '../../../db/schema.sql');
const seedPath = path.join(__dirname, '../../../db/seed.sql');

async function init() {
  console.log('🚀 Initializing Traveloop Database...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  try {
    // 1. Create Database
    console.log(`📁 Re-creating database: ${process.env.DB_NAME}...`);
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // 2. Run Schema
    console.log('📜 Running schema.sql...');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    // Remove DELIMITER lines and replace $$ with ;
    schema = schema.replace(/DELIMITER \$\$/g, '');
    schema = schema.replace(/DELIMITER ;/g, '');
    schema = schema.replace(/\$\$/g, ';');
    
    await connection.query(schema);

    // 3. Run Seed
    console.log('🌱 Running seed.sql...');
    const seed = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seed);

    console.log('✅ Database initialization complete!');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
  } finally {
    await connection.end();
  }
}

init();
