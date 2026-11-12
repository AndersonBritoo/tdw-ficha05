const mongoose = require("mongoose");
const User = require("./Models/user");

mongoose
  .connect("mongodb://localhost:27017", { dbName: "rede_carregamento" })
  .then(async () => {
    await User.deleteMany({});
    await User.create([
      { username: "admin", password: "1234" },
      { username: "anderson", password: "tdw2026" },
    ]);
    console.log("Utilizadores criados");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });