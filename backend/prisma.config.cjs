// backend/prisma.config.cjs
module.exports = {
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL
  }
};
