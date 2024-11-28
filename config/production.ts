export default {
  log: {
    level: 'info',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60, // 3uur (in seconden)
  },
};
