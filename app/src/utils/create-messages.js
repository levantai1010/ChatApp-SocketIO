const dateFormat = require("date-format");
//Khởi tạo function createMessage
const createMessage = (textMessage) => {
  return {
    textMessage,
    createAt: dateFormat("dd/MM/yyyy - hh:mm:ss", new Date()),
  };
};
module.exports = { createMessage };
