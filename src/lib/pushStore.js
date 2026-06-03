import { Redis } from '@upstash/redis';

let redis = null;

function getRedis() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
    return redis;
  }
  return null;
}

export async function addPushSubscriptionKV(subscriptionJson) {
  const r = getRedis();
  if (!r) throw new Error('Redis not configured');
  // Use SET-based storage so duplicates are ignored
  await r.sadd('push_subscriptions', subscriptionJson);
}

export async function getPushSubscriptionsKV() {
  const r = getRedis();
  if (!r) return [];
  const members = await r.smembers('push_subscriptions');
  return members || [];
}

export async function deletePushSubscriptionKV(subscriptionJson) {
  const r = getRedis();
  if (!r) return;
  await r.srem('push_subscriptions', subscriptionJson);
}

export async function getPushSubscriptionCountKV() {
  const r = getRedis();
  if (!r) return 0;
  return await r.scard('push_subscriptions');
}
