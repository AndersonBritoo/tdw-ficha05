const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postoSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "O id do posto é obrigatório"],
      unique: true,
      trim: true,
      minlength: [3, "O id deve ter pelo menos 3 caracteres"],
      maxlength: [20, "O id não pode ter mais de 20 caracteres"],
    },
    local: {
      type: String,
      required: [true, "O local do posto é obrigatório"],
      trim: true,
      minlength: [2, "O local deve ter pelo menos 2 caracteres"],
      maxlength: [50, "O local não pode ter mais de 50 caracteres"],
    },
    potenciaKw: {
      type: Number,
      required: [true, "A potência (kW) é obrigatória"],
      validate: {
        validator: (value) => value > 0,
        message: (props) =>
          `A potência deve ser superior a zero (valor recebido: ${props.value})`,
      },
      max: [350, "A potência não pode ser superior a 350 kW"],
    },
    disponivel: {
      type: Boolean,
      required: [true, "A disponibilidade do posto é obrigatória"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posto", postoSchema, "postos");
