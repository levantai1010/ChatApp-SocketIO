const socket = io();

// acknowledlgement
const acknowledlgements = (errors) => {
  if (errors) {
    // console.log("errors: ", errors);
    alert(errors);
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
// Chia sẻ vị trí
document.getElementById("btn-share-location").addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("Trình duyệt không hỗ trợ tính năng này");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      socket.emit("sendLocationToServer", location);
      console.log("Chia sẻ vị trí thành công", location);
    });
  }
});
// Nhậ sự kiện chia sẻ vị trí từ server
socket.on("sendLoactionToClient", (linkLocation) => {
  console.log(`Vị trí hiện tại của Client ${socket.id} là: `, linkLocation);
});
// Nhận lại tin nhắn từ server
socket.on("sendMessageToClient", (messages) => {
  console.log("messages:", messages);
});
