import { Sequelize } from 'sequelize';
import 'dotenv/config';

// The URL must not use pgbouncer=true for schema syncing ideally, but for basic sync it might work.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;
