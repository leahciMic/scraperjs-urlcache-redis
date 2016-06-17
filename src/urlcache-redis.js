import sha256 from './lib/sha256.js';
import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-redis';
import bluebird from 'bluebird';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisCache = cacheManager.caching({
  store: redisStore,
  host: REDIS_HOST,
  port: REDIS_PORT,
  db: 0,
  ttl: 86400,
});

bluebird.promisifyAll(redisCache);

function getCacheKey(url) {
  return `scraperjs-url-cache:${sha256(url)}`;
}

export default {
  get(url) {
    return redisCache.getAsync(getCacheKey(url));
  },
  set(url, value, ttl) {
    // redisCache expects ttl in seconds not ms
    return redisCache.setAsync(getCacheKey(url), value, { ttl: ttl / 1000 });
  },
};
