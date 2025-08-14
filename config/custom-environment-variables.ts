// config/custom-environment-variables.ts
export default {
  env: 'NODE_ENV',
  port: 'PORT',
  auth: {
    jwt: {
      secret: 'AUTH_JWT_SECRET',
    },
  },
};
