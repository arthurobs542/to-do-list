const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
let pool = null;
let useDatabase = false;

// Função para conectar ao banco
async function connectToDatabase() {
  try {
    if (process.env.DATABASE_URL) {
      // Railway PostgreSQL
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      // Testar conexão
      await pool.query("SELECT 1");
      useDatabase = true;
      console.log("✅ Conectado ao PostgreSQL do Railway");
    } else {
      // Fallback para arquivo local
      useDatabase = false;
      console.log("⚠️  Usando arquivo local (modo desenvolvimento)");
    }
  } catch (error) {
    console.error("❌ Erro na conexão com banco:", error);
    useDatabase = false;
    console.log("⚠️  Fallback para arquivo local");
  }
}

// Arquivo para salvar dados (fallback)
const DATA_FILE = path.join(__dirname, "users-data.json");

// Função para carregar dados (fallback)
function loadUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
  return {};
}

// Função para salvar dados (fallback)
function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
}

// Carregar dados existentes (fallback)
let users = loadUsers();

// Função para buscar usuário no banco
async function getUserFromDatabase(userId) {
  try {
    const result = await pool.query("SELECT get_user_complete($1) as data", [
      userId,
    ]);
    if (result.rows.length > 0) {
      return result.rows[0].data;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário no banco:", error);
  }
  return null;
}

// Função para criar usuário no banco
async function createUserInDatabase(userId, profile, settings) {
  try {
    const result = await pool.query(
      "SELECT create_user_complete($1, $2, $3) as data",
      [
        userId,
        profile?.name || "Usuário",
        profile?.email || "usuario@exemplo.com",
      ]
    );
    return result.rows[0].data;
  } catch (error) {
    console.error("Erro ao criar usuário no banco:", error);
    return null;
  }
}

// Função para atualizar usuário no banco
async function updateUserInDatabase(userId, profile, settings) {
  try {
    let result = null;

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

    return result ? result.rows[0].data : null;
  } catch (error) {
    console.error("Erro ao atualizar usuário no banco:", error);
    return null;
  }
}

// ROTAS DA API

// GET /api/health - Verificar se está funcionando
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Focus App Backend está funcionando!",
    timestamp: new Date().toISOString(),
    database: useDatabase ? "PostgreSQL (Railway)" : "Local File",
    usersCount: useDatabase ? "N/A" : Object.keys(users).length,
  });
});

// GET /api/users/:userId - Buscar usuário
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (useDatabase && pool) {
      // Usar banco PostgreSQL
      const userData = await getUserFromDatabase(userId);
      if (userData) {
        return res.json(userData);
      }
    } else {
      // Usar arquivo local
      if (users[userId]) {
        return res.json(users[userId]);
      }
    }

    // Criar usuário padrão se não existir
    const defaultUser = {
      profile: {
        id: userId,
        name: "Usuário",
        email: "usuario@exemplo.com",
        avatar: null,
        joinDate: new Date().toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        totalTasks: 0,
        completedTasks: 0,
        pomodorosCompleted: 0,
        streak: 0,
        achievements: [
          {
            id: "first-task",
            name: "Primeira Tarefa",
            description: "Complete sua primeira tarefa",
            icon: "Award",
            unlocked: false,
          },
          {
            id: "focus-master",
            name: "Foco Total",
            description: "Complete 10 pomodoros",
            icon: "Target",
            unlocked: false,
          },
          {
            id: "task-master",
            name: "Mestre das Tarefas",
            description: "Complete 50 tarefas",
            icon: "Trophy",
            unlocked: false,
          },
          {
            id: "streak-keeper",
            name: "Sequência Perfeita",
            description: "Mantenha uma sequência de 7 dias",
            icon: "Flame",
            unlocked: false,
          },
        ],
      },
      settings: {
        notifications: true,
        soundEnabled: true,
        pomodoroNotifications: true,
        taskReminders: true,
        autoSave: true,
        theme: "blue",
        language: "pt",
        volume: 50,
      },
    };

    // Salvar no banco ou arquivo
    if (useDatabase && pool) {
      const createdUser = await createUserInDatabase(
        userId,
        defaultUser.profile,
        defaultUser.settings
      );
      if (createdUser) {
        return res.json(createdUser);
      }
    } else {
      users[userId] = defaultUser;
      saveUsers(users);
    }

    res.json(defaultUser);
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

    if (useDatabase && pool) {
      const createdUser = await createUserInDatabase(id, profile, settings);
      if (createdUser) {
        return res.status(201).json(createdUser);
      }
    } else {
      users[id] = {
        profile: {
          id,
          name: profile?.name || "Usuário",
          email: profile?.email || "usuario@exemplo.com",
          avatar: profile?.avatar || null,
          joinDate: new Date().toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          }),
          totalTasks: profile?.totalTasks || 0,
          completedTasks: profile?.completedTasks || 0,
          pomodorosCompleted: profile?.pomodorosCompleted || 0,
          streak: profile?.streak || 0,
          achievements: [
            {
              id: "first-task",
              name: "Primeira Tarefa",
              description: "Complete sua primeira tarefa",
              icon: "Award",
              unlocked: false,
            },
            {
              id: "focus-master",
              name: "Foco Total",
              description: "Complete 10 pomodoros",
              icon: "Target",
              unlocked: false,
            },
            {
              id: "task-master",
              name: "Mestre das Tarefas",
              description: "Complete 50 tarefas",
              icon: "Trophy",
              unlocked: false,
            },
            {
              id: "streak-keeper",
              name: "Sequência Perfeita",
              description: "Mantenha uma sequência de 7 dias",
              icon: "Flame",
              unlocked: false,
            },
          ],
        },
        settings: {
          notifications: settings?.notifications ?? true,
          soundEnabled: settings?.soundEnabled ?? true,
          pomodoroNotifications: settings?.pomodoroNotifications ?? true,
          taskReminders: settings?.taskReminders ?? true,
          autoSave: settings?.autoSave ?? true,
          theme: settings?.theme || "blue",
          language: settings?.language || "pt",
          volume: settings?.volume || 50,
        },
      };

      saveUsers(users);
      res.status(201).json(users[id]);
    }
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

    if (useDatabase && pool) {
      const updatedUser = await updateUserInDatabase(userId, profile, settings);
      if (updatedUser) {
        return res.json(updatedUser);
      }
    } else {
      if (!users[userId]) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (profile) {
        users[userId].profile = { ...users[userId].profile, ...profile };
      }

      if (settings) {
        users[userId].settings = { ...users[userId].settings, ...settings };
      }

      if (!profile && !settings) {
        return res
          .status(400)
          .json({ error: "Dados para atualização são obrigatórios" });
      }

      saveUsers(users);
      res.json(users[userId]);
    }
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "Focus App Backend API (Railway Ready)",
    version: "1.0.0",
    database: useDatabase ? "PostgreSQL (Railway)" : "Local File",
    endpoints: [
      "GET /api/health",
      "GET /api/users/:userId",
      "POST /api/users",
      "PATCH /api/users/:userId",
    ],
    note: "Este backend funciona com PostgreSQL (Railway) ou arquivo local como fallback.",
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);

  // Conectar ao banco
  await connectToDatabase();

  if (useDatabase) {
    console.log(`🗄️  Banco: PostgreSQL (Railway)`);
  } else {
    console.log(`💾 Dados salvos em: ${DATA_FILE}`);
    console.log(`👥 Usuários carregados: ${Object.keys(users).length}`);
  }
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado:", err);
  process.exit(1);
});
