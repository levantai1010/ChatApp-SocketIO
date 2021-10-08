const dateFormat = require("date-format");
//Khởi tạo function createMessage
const createMessage = (textMessage, username) => {
  return {
    textMessage,
    username,
    createAt: dateFormat("dd/MM/yyyy - hh:mm:ss", new Date()),
  };
};
module.exports = { createMessage };
