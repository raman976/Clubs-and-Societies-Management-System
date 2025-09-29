const express = require("express");

const app = express();
app.use(express.json());

app.use("/", require("./Routes/test_route"));

app.listen(3000, () => {
  console.log("server chal gya hai");
});
