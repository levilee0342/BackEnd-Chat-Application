import { DataTypes } from "sequelize";
import { sequelize } from "~/config/mysql";
const User = sequelize.define("user", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  birth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      isPhoneNumber: function (value) {
        if (!/^\d{10}$/.test(value)) {
          throw new Error("Phone number must be 10 digits");
        }
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: "Must be a valid email address",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmpty: function (value) {
        if (value.trim() === "") {
          throw new Error("Password cannot be empty");
        }
      },
    },
  },
  avatar: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default User;
