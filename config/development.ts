// config/development.ts
export default {
  cors: {
    origins: ['http://localhost:5173', 
      'http://[::1]:5173'], // nodig voor v6 in FE testen
  },
  auth: {
    jwt: {
      expirationInterval: 60 * 60, //  in sec (1 hour)
      secret:
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
  },
};
