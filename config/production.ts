// config/production.ts
export default {
  log: {
    level: 'info',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60, // 3uur (in seconden)
  },
  auth: {
    jwt: {
      audience: 'aagis.hogent.be',
      issuer: 'aagis.hogent.be',
      expirationInterval: 60 * 60, //  in sec (1 hour)
      secret:
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
    argon: {
      hashLength: 32,
      timeCost: 6,  //iteraties
      memoryCost: 2 ** 17, // 2 tot de 17e - 128 MiB (1024)
    },
  },
};
