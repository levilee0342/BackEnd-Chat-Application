import "dotenv/config";
import { Sequelize } from "sequelize";
const dbConfig = process.env;
const sequelize = new Sequelize(dbConfig.SQL_NAME, dbConfig.SQL_USER, dbConfig.SQL_PWD, {
  logging: false,
  host: dbConfig.SQL_HOST,
  dialect: dbConfig.DIALECT,
  operatorsAliases: 0,
  pool: {
    max: parseInt(dbConfig.POOL_MAX),
    min: parseInt(dbConfig.POOL_MIN),
    acquire: parseInt(dbConfig.POOL_ACQUIRE),
    idle: parseInt(dbConfig.POOL_IDLE),
  },
});
const connectToSql = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync({ alter: false }).then(() => {
      console.log("yes re-sync done !");
    });
    console.log("Connect to mysql successfully");
  } catch (error) {
    console.log("Error when connect to mysql: ", error.message);
    // process.exit(1);
  }
};
export { sequelize, connectToSql };
