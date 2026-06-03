const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: 'https://oriented-oarfish-142606.upstash.io',
  token: 'gQAAAAAAAi0OAAIgcDFlZTBmNmZhMjUwNjI0NTY0OTkyYjM5Yjc3ZWY2NWUxNw',
});

async function clearAndCheck() {
  console.log('📡 Connecting to Upstash Redis...');
  
  // Check current count
  const count = await redis.scard('push_subscriptions');
  console.log(`📊 Current subscriptions: ${count}`);
  
  // Delete all old subscriptions (they were created with wrong VAPID keys)
  if (count > 0) {
    await redis.del('push_subscriptions');
    console.log('🗑️  Cleared all old subscriptions');
  }

  // Verify
  const newCount = await redis.scard('push_subscriptions');
  console.log(`✅ Subscriptions after cleanup: ${newCount}`);
  console.log('');
  console.log('Endi telefoningizda:');
  console.log('1. Saytni oching: https://prim-uslugi-service-platform.vercel.app');
  console.log('2. Brauzer sozlamalaridan sayt ma\'lumotlarini tozalang (Clear site data)');
  console.log('3. Saytni qayta yuklang va bildirishnomaga RUXSAT BERING');
  console.log('4. Admin paneldan push xabar yuboring');
}

clearAndCheck().catch(console.error);
