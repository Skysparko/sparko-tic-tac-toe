const e = require("express");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");

//middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

//rendering particular files according to the location
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/uuid", (req, res) => {
  res.redirect("/" + uuidv4());
});

app.get("/:roomID", (req, res) => {
  res.render("room", {
    roomId: req.params.roomID,
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    let room = io.sockets.adapter.rooms.get(roomId);
    let roomSize = 0;
    if (room) {
      roomSize = room.size;
    }
    if (roomSize < 2) {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected");
      socket.on("disconnect", () => {
        socket.broadcast.to(roomId).emit("user-disconnected");
      });

      socket.on("can-play", () => {
        socket.broadcast.to(roomId).emit("can-play");
      });
      socket.on("clicked", (id) => {
        socket.broadcast.to(roomId).emit("clicked", id);
      });
    } else {
      socket.emit("full-room");
    }
  });
});

//listing to the given port
server.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
