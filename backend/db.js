const { PrismaClient } = require('@prisma/client');

// Prisma avec pool Supabase
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=1&pool_timeout=6'
    }
  },
  log: process.env.NODE_ENV === 'production' ? [] : ['warn']
});

module.exports = prisma;
