const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

// Singleton Prisma (fix "prepared statement already exists")
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['warn', 'error']
  });
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await pool.end();  
});

module.exports = prisma;
