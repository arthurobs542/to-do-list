const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Testar conexão com banco
pool.on("connect", () => {
  console.log("✅ Conectado ao banco PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Erro na conexão com banco:", err);
});

// ROTAS DA API

// GET /api/users/:userId - Buscar usuário
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query("SELECT get_user_complete($1) as data", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0].data);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/users - Criar usuário
app.post("/api/users", async (req, res) => {
  try {
    const { id, profile, settings } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    // Criar usuário usando a função do banco
    const result = await pool.query(
      "SELECT create_user_complete($1, $2, $3) as data",
      [id, profile?.name || "Usuário", profile?.email || "usuario@exemplo.com"]
    );

    res.status(201).json(result.rows[0].data);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PATCH /api/users/:userId - Atualizar usuário
app.patch("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { profile, settings } = req.body;

    let result;

    if (profile) {
      result = await pool.query("SELECT update_user_profile($1, $2) as data", [
        userId,
        JSON.stringify(profile),
      ]);
    }

    if (settings) {
      result = await pool.query("SELECT update_user_settings($1, $2) as data", [
        userId,
        JSON.stringify(settings),
      ]);
    }

    if (!profile && !settings) {
      return res
        .status(400)
        .json({ error: "Dados para atualização são obrigatórios" });
    }

    res.json(result.rows[0].data);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /api/health - Verificar se está funcionando
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Focus App Backend está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "Focus App Backend API",
    version: "1.0.0",
    endpoints: [
      "GET /api/health",
      "GET /api/users/:userId",
      "POST /api/users",
      "PATCH /api/users/:userId",
    ],
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado:", err);
  process.exit(1);
});
