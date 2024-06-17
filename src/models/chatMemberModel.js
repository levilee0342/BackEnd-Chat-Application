import { sequelize } from "~/config/mysql";
import { DataTypes } from "sequelize";
const ChatMember = sequelize.define("chat_member", {
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
export default ChatMember;
