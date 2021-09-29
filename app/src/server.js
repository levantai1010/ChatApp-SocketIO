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
  // Xử lý sự kiện nhận tin nhắn từ client
  socket.on("sendMessageToServer", (textMessage, callback) => {
    io.emit("sendMessageToClient", textMessage);
    callback();
  });
  // Sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`CLient ${socket.id} left server`);
  });
});
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} `);
});
