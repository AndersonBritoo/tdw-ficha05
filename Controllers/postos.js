const express = require("express");
const router = express.Router();
const Posto = require("../Models/posto");

const CAMPOS = ["id", "local", "potenciaKw", "disponivel"];

function tratarErro(error, res) {
  if (error.name === "ValidationError") {
    const erros = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ erro: "Dados inválidos", detalhes: erros });
  }
  if (error.code === 11000) {
    return res.status(409).json({ erro: "Já existe um posto com esse id" });
  }
  return res.status(500).json({ erro: error.message });
}

router.get("/", async (req, res) => {
  try {
    const filtro = {};
    if (req.query.disponivel !== undefined) {
      if (!["true", "false"].includes(req.query.disponivel)) {
        return res
          .status(400)
          .json({ erro: "O parâmetro disponivel deve ser true ou false" });
      }
      filtro.disponivel = req.query.disponivel === "true";
    }
    const postos = await Posto.find(filtro);
    return res.status(200).json(postos);
  } catch (error) {
    return tratarErro(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const posto = await Posto.findOne({ id: req.params.id });
    if (!posto) return res.status(404).json({ erro: "Posto não encontrado" });
    return res.status(200).json(posto);
  } catch (error) {
    return tratarErro(error, res);
  }
});

router.post("/", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ erro: "Body em falta" });
  }
  try {
    const { id, local, potenciaKw, disponivel } = req.body;
    const posto = await Posto.create({ id, local, potenciaKw, disponivel });
    return res.status(201).json(posto);
  } catch (error) {
    return tratarErro(error, res);
  }
});

router.put("/:id", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ erro: "Body em falta" });
  }
  try {
    const { id, local, potenciaKw, disponivel } = req.body;
    const posto = await Posto.findOneAndUpdate(
      { id: req.params.id },
      { id, local, potenciaKw, disponivel },
      { new: true, runValidators: true }
    );
    if (!posto) return res.status(404).json({ erro: "Posto não encontrado" });
    return res.status(200).json(posto);
  } catch (error) {
    return tratarErro(error, res);
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ erro: "Body em falta" });
  }
  try {
    const alteracoes = {};
    for (const campo of CAMPOS) {
      if (req.body[campo] !== undefined) alteracoes[campo] = req.body[campo];
    }
    if (Object.keys(alteracoes).length === 0) {
      return res.status(400).json({ erro: "Nenhum campo válido enviado" });
    }
    const posto = await Posto.findOneAndUpdate(
      { id: req.params.id },
      { $set: alteracoes },
      { new: true, runValidators: true }
    );
    if (!posto) return res.status(404).json({ erro: "Posto não encontrado" });
    return res.status(200).json(posto);
  } catch (error) {
    return tratarErro(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const posto = await Posto.findOneAndDelete({ id: req.params.id });
    if (!posto) return res.status(404).json({ erro: "Posto não encontrado" });
    return res.status(200).json(posto);
  } catch (error) {
    return tratarErro(error, res);
  }
});

module.exports = router;
