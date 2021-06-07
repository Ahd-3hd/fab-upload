require("dotenv").config();

const express = require("express");

app = express();

app.use("/", require("./routes/upload"));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`listening at ${PORT}`);
});
