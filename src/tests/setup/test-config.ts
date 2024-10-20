export const testConfig = () => ({
  DATABASE_URL: `postgresql://user:azerty123@localhost:${process.env.COMPOSE_DB_PORT}/rentmyhouse`,
  REDIS_CONNECTION_URL: `redis://default@localhost:${process.env.COMPOSE_REDIS_PORT}`,
  ENVIRONMENT: 'test',
  SMTP_HOST: 'mailer',
  SMTP_PORT: process.env.COMPOSE_MAILER_SMTP_PORT,
  SMTP_USER: '',
  SMTP_PASSWORD: '',
});
