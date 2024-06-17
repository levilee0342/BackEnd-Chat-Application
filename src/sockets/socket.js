function getMessage(io) {
  io.on("connect", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("send_message", (data) => {
      socket.broadcast.emit("receive_message");
    });
  });
}
export { getMessage };
