const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?pgbouncer=true&prepare=false',
  max: 5,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['warn', 'error'] });

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await pool.end();
});

module.exports = prisma;
