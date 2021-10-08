const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const Filter = require("bad-words");

const { createMessage } = require("./utils/create-messages");
const { getUserList, addUser, removeUser, findUser } = require("./utils/users");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
app.use(express.static(path.join(__dirname, "../public")));

// const pathPublicDirectory = path.join(__dirname, "../public");
// // http://localhost:7000 => đi vào thư mục public
// app.use(express.static(pathPublicDirectory));

io.on("connection", (socket) => {
  console.log("Server connecting!");

  // Nhận sự kiện joinRoom từ cient
  socket.on("joinRoom", ({ room, username }) => {
    socket.join(room);
    //Xử lý câu chào
    socket.emit(
      "sendMessageToClient",
      createMessage(`Wellcome  ${username} to room ${room}`, "Admin")
    );
    socket.broadcast
      .to(room)
      .emit(
        "sendMessageToClient",
        createMessage(`${username} joined room ${room}`, "Admin")
      );

    // Xử lý userList(// Thêm user vào UserList)

    addUser({
      id: socket.id,
      username,
      room,
    });
    io.to(room).emit("sendUserListToClient", getUserList(room));

    // Xử lý sự kiện nhận tin nhắn từ client
    socket.on("sendMessageToServer", (textMessage, callback) => {
      // Xử lý từ khóa tục tĩu
      const filter = new Filter();
      if (filter.isProfane(textMessage)) {
        // return callback("Tin nhắn không hợp lệ");
        return callback("Invalid messages");
      }

      // Gởi tin nhắn về cho tất cả các client
      const user = findUser(socket.id);
      io.to(room).emit(
        "sendMessageToClient",
        createMessage(textMessage, user.username)
      );
      callback();
    });
    // Nhận sự kiện share location từ client
    socket.on("sendLocationToServer", ({ latitude, longitude }) => {
      const user = findUser(socket.id);
      const linkLocation = `https://google.com/maps?q=${latitude},${longitude}`;
      io.to(room).emit("sendLoactionToClient", linkLocation, user);
    });
    // Sự kiện ngắt kết nối
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit("sendUserListToClient", getUserList(room));
    });
  });
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} `);
});
