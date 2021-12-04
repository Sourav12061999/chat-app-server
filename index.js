const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const users = require("./Schemas/user.schema");
const channels = require("./Schemas/channel.schema");
const message = require("./Schemas/message.schema");
app.use(cors());
app.use(express.json());
const connect = () => {
  return mongoose.connect(
    "mongodb+srv://Sourav:Sourav1999@cluster0.jbmyk.mongodb.net/chatapp"
  );
};
const PORT = process.env.PORT || 5001;
app.post("/api/users", async function (req, res) {
  let data = await users.create(req.body);
  res.send(data);
  // console.log(data);
});
app.post("/api/existingusers", async function (req, res) {
  let data = await users
    .findOne({ email: req.body.email })
    .populate({ path: "channels", select: "name" })
    .lean()
    .exec();
  res.send(data);
  // console.log(data);
});

app.patch("/api/existingusers/userId=:userId", async function (req, res) {
  let newData = req.body;
  let data = await users
    .findByIdAndUpdate(req.params.userId, { ...newData }, { new: true })
    .populate({ path: "channels", select: "name" });
  res.send(data);
});
app.post("/api/channels", async function (req, res) {
  let data = await channels.create(req.body);
  res.send(data._id);
});
app.post("/api/message", async function (req, res) {
  let data = await message.create(req.body);
  res.send(data._id);
});
app.patch("/api/channels/channelId=:channelId", async function (req, res) {
  let newData = await channels.findById(req.params.channelId);
  newData.messages.push(req.body.messageId);
  let data = await channels.findByIdAndUpdate(
    req.params.channelId,
    { ...newData },
    { new: true }
  );
  res.send(data);
});
app.get("/api/channels/channelId=:channelId", async (req, res) => {
  let data = await channels
    .findById(req.params.channelId)
    .populate("messages")
    .lean()
    .exec();
  res.send(data.messages);
});
app.get("/api/channels/channelIdFull=:channelId", async (req, res) => {
  try {
    let data = await channels
      .findById(req.params.channelId)
      .populate("messages")
      .lean()
      .exec();
    res.send(data);
  } catch (err) {
    res.send(err.message);
  }
});
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const start = async () => {
  await connect();
  server.listen(PORT, () => {
    console.log("SERVER RUNNING");
  });
};

start();
