const socket = io();

// acknowledlgement
const acknowledlgements = (errors) => {
  if (errors) {
    console.log("errors: ", errors);
  } else {
    console.log("Đã gởi tin nhắn thành công");
  }
};
// Sự kiện sublit
document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const textMessage = document.getElementById("input-text").value;
  document.getElementById("input-text").value = " ";
  socket.emit("sendMessageToServer", textMessage, acknowledlgements);
});

// Nhận lại sự kiện từ server
socket.on("sendMessageToClient", (textMessage) => {
  console.log("textMessage:", textMessage);
});
