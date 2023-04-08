const childProcess = require("node:child_process");
const path = require("node:path");
const express = require("express");
const bodyParser = require("body-parser");
const minecraftInstance = childProcess.spawn(
  `${path.resolve("java/bin/java.exe")}`,
  [
    "-server",
    "-Xms1024M",
    "-Xmx4096M",
    "-jar",
    path.resolve("server/server.jar"),
    "nogui",
  ],
  { cwd: path.resolve("server/") }
);
minecraftInstance.stdout.on("data", (data) => {
  console.log(data.toString());
});

minecraftInstance.stdout.on("error", (data) => {
  console.error(data.toString());
});
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  if (req.body.cmd) {
    minecraftInstance.stdin.write(req.body.cmd + "\r");
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});
const port = 55555;
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
