const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Arquivo para salvar dados
const DATA_FILE = path.join(__dirname, "users-data.json");

// Função para carregar dados
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

// Função para salvar dados
function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
}

// Carregar dados existentes
let users = loadUsers();

// ROTAS DA API

// GET /api/health - Verificar se está funcionando
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Focus App Backend está funcionando!",
    timestamp: new Date().toISOString(),
    usersCount: Object.keys(users).length,
  });
});

// GET /api/users/:userId - Buscar usuário
app.get("/api/users/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    if (!users[userId]) {
      // Criar usuário padrão se não existir
      users[userId] = {
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

      // Salvar dados
      saveUsers(users);
    }

    res.json(users[userId]);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST /api/users - Criar usuário
app.post("/api/users", (req, res) => {
  try {
    const { id, profile, settings } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

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

    // Salvar dados
    saveUsers(users);

    res.status(201).json(users[id]);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PATCH /api/users/:userId - Atualizar usuário
app.patch("/api/users/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const { profile, settings } = req.body;

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

    // Salvar dados
    saveUsers(users);

    res.json(users[userId]);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "Focus App Backend API (Modo Persistente)",
    version: "1.0.0",
    endpoints: [
      "GET /api/health",
      "GET /api/users/:userId",
      "POST /api/users",
      "PATCH /api/users/:userId",
    ],
    note: "Este backend salva os dados em arquivo local. Os dados persistem entre reinicializações.",
    dataFile: DATA_FILE,
    usersCount: Object.keys(users).length,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Dados salvos em: ${DATA_FILE}`);
  console.log(`👥 Usuários carregados: ${Object.keys(users).length}`);
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado:", err);
  process.exit(1);
});
