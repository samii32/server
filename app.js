const express = require("express")
const http = require("http")
const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io")

const io = socketIO(server);

app.use(express.static(path.join(__dirname, "")))

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server is running...${PORT}`))

