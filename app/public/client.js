// const { findUser } = require("../src/utils/users");
let levantai;

const socket = io();

// acknowledlgement
const acknowledlgements = (errors) => {
  if (errors) {
    // console.log("errors: ", errors);
    alert(errors);
  } else {
    console.log("Send messages successfull!!!");
  }
};
// Sự kiện sublit
document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const textMessage = document.getElementById("input-messages").value;
  document.getElementById("input-messages").value = " ";
  socket.emit("sendMessageToServer", textMessage, acknowledlgements);
});
// Chia sẻ vị trí
document.getElementById("btn-share-location").addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("Browser not support!!!");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      socket.emit("sendLocationToServer", location);
      //console.log("Share location successfull", location);
    });
  }
});
// Nhậ sự kiện chia sẻ vị trí từ server
socket.on("sendLoactionToClient", (linkLocation, user) => {
  // console.log(`Vị trí hiện tại của  ${user.username} là: `, linkLocation);
  document.getElementById("app__messages").innerHTML += `
  <div class="message-item">
  <a href="${linkLocation}" target="_blank">Location of ${user.username}</a>
  </div>
  `;
});
// Nhận lại tin nhắn từ server
socket.on("sendMessageToClient", (messages) => {
  // console.log("messages:", messages);
  document.getElementById("app__messages").innerHTML += `
  <div class="message-item">
            <div class="message__row1">
              <p class="message__name">${messages.username}</p>
              <p class="message__date">${messages.createAt}</p>
            </div>
            <div class="message__row2">
              <p class="message__content">
              ${messages.textMessage}
              </p>
            </div>
          </div>
  `;
});
// Xử lý queryString
const { room, username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true, // Bỏ dấu ? trên trình duyệt
});
// Gởi event join lên server
socket.emit("joinRoom", { room, username });
// XỬ lý userList
socket.on("sendUserListToClient", (userList) => {
  // console.log("UserList: ", userList);
  document.getElementById("app__list-user--content").innerHTML = "";
  userList.map((user) => {
    document.getElementById("app__title").innerHTML = user.room;
    document.getElementById("app__list-user--content").innerHTML += `
    <li class="app__item-user">${user.username}</li>

  `;
  });
  // for (let index = 0; index < userList.length; index++) {
  //   document.getElementById("app__list-user--content").innerHTML += `
  //      <li class="app__item-user">${userList[index].username}</li>

  //    `;
  // }
});
