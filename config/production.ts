// config/production.ts
export default {
  auth: {
    jwt: {
      expirationInterval: 7 * 24 * 60 * 60, //  in sec (7 dagen)
    },
  },
};
