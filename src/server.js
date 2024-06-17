import express from "express";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes";
import { errorResponseHandler, invalidPathHandler } from "./middlewares/errorHandlingMiddleware";
import { connectToSql } from "./config/mysql";
import { connectToMongoDB } from "./config/mongodb";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { getMessage } from "./sockets/socket";
const app = express();

// config để kết nối đến với FE
const corsOptions = {
  origin: [process.env.CLIENT_URL],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // sử dụng cors
app.use(express.json()); // dùng để đọc dữ liệu từ body của request
connectToSql(); // kết nối đến mysql
connectToMongoDB(); // kết nối đến mongodb
app.use("/api", router); // cấu hình router

app.use(invalidPathHandler); //xử lí lỗi khi nhập sai path
app.use(errorResponseHandler); // xử lí tất cả các lỗi trong khi code
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });
getMessage(io);
server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
