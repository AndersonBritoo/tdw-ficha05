const express = require("express");
const mongoose = require("mongoose");
const postosRoutes = require("./Controllers/postos");
const auth = require("./Middleware/auth");

const app = express();
const port = 4000;

app.use(express.json());

// ---------------------------------------------------------------
// A. Middleware: regista o tipo de pedido e o dia/hora a que chegou
// ---------------------------------------------------------------
app.use(function (req, res, next) {
  const agora = new Date().toLocaleString("pt-PT");
  console.log(`[${agora}] Pedido recebido: ${req.method} ${req.originalUrl}`);
  next();
});


const connect = mongoose.connect("mongodb+srv://andersonbritodev_db_user:andersonbritodev_db_user@cluster0.dbkvxui.mongodb.net/");

connect
  .then(() => {
    console.log("Ligacao ao servidor estabelecida");

    // B. Routers: associa o prefixo /postos aos endpoints do controlador
    // (extra: middleware de autenticação aplicado às rotas de /postos)
    app.use("/postos", auth, postosRoutes);

    // Rota inexistente
    app.use((req, res) => res.status(404).json({ erro: "Rota não encontrada" }));

    // JSON inválido no body, etc.
    app.use((err, req, res, next) => {
      if (err.type === "entity.parse.failed") {
        return res.status(400).json({ erro: "JSON inválido" });
      }
      return res.status(500).json({ erro: err.message });
    });

    app.listen(port, () => {
      console.log(`Rede de carregamento na porta ${port}`);
    });
  })
  .catch((error) => console.error("Erro ao ligar ao MongoDB:", error));
