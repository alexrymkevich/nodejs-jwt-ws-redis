const Redis = require('ioredis');

const clientRedis = new Redis({
  port: process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  db: 0,
});

const storeService = function () {
  const set = (key, data) => clientRedis.set(key, JSON.stringify(data));
  const get = (key) => clientRedis.get(key);

  return {
    set,
    get,
  };
};

module.exports = storeService;
