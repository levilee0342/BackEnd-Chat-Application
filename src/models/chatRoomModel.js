import { sequelize } from "~/config/mysql";
import { DataTypes } from "sequelize";
import User from "./userModel";
import ChatMember from "./chatMemberModel";

const ChatRoom = sequelize.define("chat_room", {
  chatRoomId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  latestMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
ChatRoom.belongsToMany(User, {
  through: ChatMember,
  foreignKey: "chatRoomId",
});
User.belongsToMany(ChatRoom, {
  through: ChatMember,
  foreignKey: "userId",
});
export default ChatRoom;
