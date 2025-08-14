// config/production.ts
export default {
  cors: {
    origins: ['https://frontendweb-2425-patrickvankerckhove-a71b.onrender.com'],
  },
  auth: {
    jwt: {
      expirationInterval: 7 * 24 * 60 * 60, //  in sec (7 dagen)
    },
  },
};
