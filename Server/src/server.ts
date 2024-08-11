import env from "./utils/validateEnv";
import mongoose from "mongoose";
import app from "./app";
import { Server } from "socket.io";
import http from "http";

const socketPort = 8200;
const port = env.PORT;
const connectionString = env.MONGO_URI;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  pingInterval: 5000,
  pingTimeout: 10000,
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

server.listen(socketPort, () => {
  console.log("Socket.IO server running on port", socketPort);
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(port, () => {
      console.log("Server running on port: " + port);
      console.log(env.FRONT_END_URL);
    });
  })
  .catch((err) => {
    console.error("Something went wrong! Couldn't connect to mongoose");
    console.log(err.message);
  });

io.on("connection", (socket) => {
  
  console.log("socket running on " + socketPort, socket.id);

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
  
  socket.on("room:join", (data) => {
    const { email, room } = data;
    console.log(data);

    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    io.to(room).emit("user:joined", { email, id: socket.id });

    socket.join(room);

    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    console.log("call:accepted", ans);
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("chat:message", ({ from, message, room }) => {
    io.to(room).emit("chat:message", { message, from });
  });
});
