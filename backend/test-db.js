require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  console.log('✅ Prisma connected');
  prisma.$disconnect();
}).catch(e => console.error('❌', e.message));
