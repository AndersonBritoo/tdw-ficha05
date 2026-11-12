const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "O username é obrigatório"],
      unique: true,
      trim: true,
      minlength: [3, "O username deve ter pelo menos 3 caracteres"],
    },
    password: {
      type: String,
      required: [true, "A password é obrigatória"],
      minlength: [4, "A password deve ter pelo menos 4 caracteres"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");