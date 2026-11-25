process.loadEnvFile();

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  //si LOG=ON o si no se define en .env, vale true; solo si pones LOG=OFF vale false
  LOG: (process.env.LOG ?? 'ON').toUpperCase() !== 'OFF',
};