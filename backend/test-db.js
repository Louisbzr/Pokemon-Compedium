require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

console.log('🌐 DATABASE_URL:', process.env.DATABASE_URL || 'NULL !!!!');
console.log('🔌 DIRECT_URL:', process.env.DIRECT_URL || 'NULL');

if (!process.env.DATABASE_URL) {
  console.error('❌ .env DATABASE_URL manquant !');
  process.exit(1);
}

// Test pooler 6543 (transaction)
console.log('🧪 Test POOLER 6543...');
const poolerPool = new Pool({
  connectionString: process.env.DATABASE_URL + '?pgbouncer=true&prepare=false',
});

// Test direct 5432
console.log('🧪 Test DIRECT 5432...');
const directPool = new Pool({
  connectionString: process.env.DIRECT_URL + '?sslmode=disable',
});

// Test pooler 
poolerPool.query('SELECT NOW() as now, version() as pg_version')
  .then(res => {
    console.log('✅ POOLER OK:', res.rows[0]);
    poolerPool.end();
    return directPool.query('SELECT NOW()');
  })
  .then(res => {
    console.log('✅ DIRECT OK:', res.rows[0]);
    directPool.end();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR:', err.code || 'NO_CODE', err.message);
    [poolerPool, directPool].forEach(p => p.end());
    process.exit(1);
  });
