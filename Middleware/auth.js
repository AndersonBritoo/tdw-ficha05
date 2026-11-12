const User = require("../Models/user");

function pedirAutenticacao(res) {
  res.set("WWW-Authenticate", "Basic");
  return res.status(401).json({ erro: "Não autenticado" });
}

async function auth(req, res, next) {
  try {
    // 1) O header autorizadod
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Basic ")) {
      return pedirAutenticacao(res);
    }

    // 2) Base64 -> "username:password"
    const credenciais = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separador = credenciais.indexOf(":");
    if (separador === -1) return pedirAutenticacao(res);

    const username = credenciais.slice(0, separador);
    const password = credenciais.slice(separador + 1);

    // 3) Existe na base de dados?
    const user = await User.findOne({ username, password });
    if (!user) return pedirAutenticacao(res);

    return next();
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

module.exports = auth;