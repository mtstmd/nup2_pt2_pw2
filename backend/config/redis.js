const Redis = require('ioredis');

const redis = new Redis({
  host: '127.0.0.1', 
  port: 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('Conectado ao Redis com sucesso!');
});

redis.on('error', (err) => {
  console.error('Erro ao conectar ao Redis:', err);
});

module.exports = redis;