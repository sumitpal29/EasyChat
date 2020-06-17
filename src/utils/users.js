const users = [];
// add user, track new user
const addUser = ({ id, username, room }) => {
  // Cleaning up data
  // make the lowercase and store them
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  // check for existing user
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  // validate username
  if (existingUser) {
    return {
      error: "Username for this room already in use",
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);

  return { user };
};

// remove user on leave
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// getUser

const getUser = (id) => {
    if(!id) {
        return {
            error: 'ID required!'
        }
    }
    return users.find(user => user.id === id)
}
// getUsersInRoom
const getUsersInRoom = (room) => {
    if(!room) {
        return {error: 'Room name required!'}
    }
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// TESTING

// addUser({
//     id: 11,
//     username: 'Sammy',
//     room: 'test'
// })

// addUser({
//     id: 12,
//     username: 'Danny',
//     room: 'Indipop'
// })

// const res = addUser({
//     id: 21,
//     username: 'sammy2',
//     room: 'test'
// })

// const removedUser = removeUser(11)
// console.log(users)
// console.log(getUser(12))
// console.log(getUsersInRoom('test'))