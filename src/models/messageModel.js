import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    from: {
      type: Number,
      required: true,
    },
    to: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
