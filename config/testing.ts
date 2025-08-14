// config/testing.ts
export default {
  auth: {
    maxDelay: 0, // msec ( 0 seconds)
    jwt: {
      expirationInterval: 60 * 60, //  in sec (1 hour)
      secret:
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
  },
};
