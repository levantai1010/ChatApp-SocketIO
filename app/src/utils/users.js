let userList = [
  //   {
  //     id: "1",
  //     username: "Hung",
  //     room: "fe01",
  //   },
  //   {
  //     id: "2",
  //     username: "Dung",
  //     room: "fe02",
  //   },
];
const getUserList = (room) => userList.filter((user) => user.room === room);
const addUser = (user) => (userList = [...userList, user]);
const removeUser = (id) => {
  userList = userList.filter((user) => user.id !== id);
};
module.exports = { getUserList, addUser, removeUser };
