const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prim_uslugi.db');
const db = new Database(dbPath);

const mockSubscription = {
  endpoint: "https://updates.push.services.mozilla.com/wpush/v2/gAAAAAB-fake-endpoint-key",
  keys: {
    auth: "fake_auth_key_12345",
    p256dh: "BLmOWpY3u4Z_fake_p256dh_key_abcdefg"
  }
};

try {
  console.log(`📡 Connecting to database at: ${dbPath}`);
  
  db.prepare('INSERT OR IGNORE INTO push_subscriptions (subscription_json) VALUES (?)')
    .run(JSON.stringify(mockSubscription));

  console.log('✅ Success! Added a mock subscriber to prim_uslugi.db.');
  console.log('🔄 Open the admin push page and click "Refresh" to see subscriber count increase to 1.');

} catch (err) {
  console.error('❌ Error adding mock subscriber:', err.message);
} finally {
  db.close();
}
