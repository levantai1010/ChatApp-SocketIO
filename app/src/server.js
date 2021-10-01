// const express = require("express");
// const app = express();
// const PORT = 3000;
// const path = require("path");
// app.use("/public", express.static(path.join(__dirname, "public")));
// app.listen(process.env.PORT || PORT, () => {
//   console.log(`server running on ${PORT} `);
// });

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const Filter = require("bad-words");
const dateFormat = require("date-format");
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
  //Xử lý câu chào
  socket.emit(
    "sendMessageToClient",
    `Chào mừng client ${socket.id} đén với phòng chat`
  );
  socket.broadcast.emit(
    "sendMessageToClient",
    `CLient ${socket.id} vừa mới tham gia vào phòng chat`
  );
  // Xử lý sự kiện nhận tin nhắn từ client
  socket.on("sendMessageToServer", (textMessage, callback) => {
    // Xử lý từ khóa tục tĩu
    const filter = new Filter();
    if (filter.isProfane(textMessage)) {
      // return callback("Tin nhắn không hợp lệ");
      return callback("Tin nhắn không hợp lệ");
    }
    // Gởi tin nhắn về cho tất cả các client
    const messages = {
      textMessage,
      createAt: dateFormat("dd/MM/yyyy - hh:mm:ss", new Date()),
    };
    io.emit("sendMessageToClient", messages);
    callback();
  });
  // Nhận sự kiện share location từ client
  socket.on("sendLocationToServer", ({ latitude, longitude }) => {
    const linkLocation = `https://google.com/maps?q=${latitude},${longitude}`;
    io.emit("sendLoactionToClient", linkLocation);
  });
  // Sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`CLient ${socket.id} left server`);
  });
});
const PORT = 3000;
httpServer.listen(process.env.PORT || PORT, () => {
  console.log(`server running on http://localhost:${PORT} `);
});
