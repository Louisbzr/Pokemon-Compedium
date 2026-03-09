const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

const prisma = new PrismaClient({
  log: ['warn', 'error']
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await pool.end();  
});

module.exports = prisma;
