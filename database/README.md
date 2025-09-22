# Database Setup para Railway PostgreSQL

Este diretório contém todos os arquivos necessários para configurar o banco de dados PostgreSQL no Railway para o Focus App.

## 📁 Estrutura dos Arquivos

```
database/
├── README.md                    # Este arquivo
├── schema.sql                   # Schema completo do banco
├── functions.sql                # Funções auxiliares
├── railway_setup.sql           # Setup completo para Railway
└── migrations/
    └── 001_initial_setup.sql   # Migration inicial
```

## 🚀 Configuração no Railway

### 1. Conectar ao PostgreSQL

No seu projeto Railway, acesse a aba "Data" e clique em "Connect" para obter as credenciais de conexão.

### 2. Executar o Setup

Execute os arquivos na seguinte ordem:

```bash
# 1. Schema inicial
psql "postgresql://username:password@host:port/database" -f database/migrations/001_initial_setup.sql

# 2. Funções e triggers
psql "postgresql://username:password@host:port/database" -f database/functions.sql

# 3. Setup completo (opcional - executa tudo)
psql "postgresql://username:password@host:port/database" -f database/railway_setup.sql
```

### 3. Via Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Fazer login
railway login

# Conectar ao projeto
railway link

# Executar SQL
railway run psql -f database/railway_setup.sql
```

## 📊 Estrutura das Tabelas

### `users`

- **id**: ID único do usuário (VARCHAR)
- **created_at**: Data de criação
- **updated_at**: Data da última atualização

### `user_profiles`

- **id**: UUID único do perfil
- **user_id**: Referência ao usuário
- **name**: Nome do usuário
- **email**: Email do usuário
- **avatar**: URL do avatar (opcional)
- **join_date**: Data de entrada
- **total_tasks**: Total de tarefas criadas
- **completed_tasks**: Tarefas concluídas
- **pomodoros_completed**: Pomodoros completados
- **streak**: Sequência de dias produtivos

### `user_settings`

- **id**: UUID único das configurações
- **user_id**: Referência ao usuário
- **notifications**: Notificações ativas
- **sound_enabled**: Som ativo
- **pomodoro_notifications**: Notificações de pomodoro
- **task_reminders**: Lembretes de tarefas
- **auto_save**: Salvamento automático
- **theme**: Tema de cores (blue, green, purple, red)
- **language**: Idioma (pt, en, es)
- **volume**: Volume do som (0-100)

### `achievements`

- **id**: UUID único da conquista
- **achievement_id**: ID da conquista
- **name**: Nome da conquista
- **description**: Descrição
- **icon**: Ícone (lucide-react)

### `user_achievements`

- **id**: UUID único
- **user_id**: Referência ao usuário
- **achievement_id**: Referência à conquista
- **unlocked**: Se foi desbloqueada
- **unlocked_at**: Data do desbloqueio

## 🔧 Funções Disponíveis

### `create_user_complete(user_id, name, email)`

Cria um usuário completo com perfil, configurações e conquistas padrão.

**Retorna**: JSON com todos os dados do usuário

### `get_user_complete(user_id)`

Busca todos os dados de um usuário.

**Retorna**: JSON com perfil, configurações e conquistas

### `update_user_profile(user_id, profile_json)`

Atualiza o perfil do usuário.

**Parâmetros**:

- `user_id`: ID do usuário
- `profile_json`: JSON com dados do perfil

### `update_user_settings(user_id, settings_json)`

Atualiza as configurações do usuário.

**Parâmetros**:

- `user_id`: ID do usuário
- `settings_json`: JSON com configurações

### `unlock_achievement(user_id, achievement_id)`

Desbloqueia uma conquista específica.

### `check_and_unlock_achievements(user_id)`

Verifica e desbloqueia conquistas automaticamente baseado nas estatísticas.

## 📝 Exemplos de Uso

### Criar um usuário

```sql
SELECT create_user_complete('user_123', 'João Silva', 'joao@email.com');
```

### Buscar dados do usuário

```sql
SELECT get_user_complete('user_123');
```

### Atualizar perfil

```sql
SELECT update_user_profile('user_123', '{
  "name": "João Silva Santos",
  "totalTasks": 10,
  "completedTasks": 8
}'::json);
```

### Atualizar configurações

```sql
SELECT update_user_settings('user_123', '{
  "theme": "green",
  "notifications": false,
  "volume": 75
}'::json);
```

### Desbloquear conquista

```sql
SELECT unlock_achievement('user_123', 'first-task');
```

## 🔍 Verificações

### Listar todas as tabelas

```sql
\dt
```

### Verificar funções criadas

```sql
\df
```

### Testar conectividade

```sql
SELECT version();
```

## 🚨 Troubleshooting

### Erro de permissão

Se você receber erro de permissão, certifique-se de que o usuário tem privilégios para:

- CREATE TABLE
- CREATE FUNCTION
- CREATE TRIGGER
- CREATE INDEX

### Extensão uuid-ossp não encontrada

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Verificar se as tabelas foram criadas

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

## 📋 Checklist de Configuração

- [ ] PostgreSQL criado no Railway
- [ ] Credenciais de conexão obtidas
- [ ] Extensão uuid-ossp instalada
- [ ] Tabelas criadas (users, user_profiles, user_settings, achievements, user_achievements)
- [ ] Funções criadas
- [ ] Triggers configurados
- [ ] Índices criados
- [ ] Conquistas padrão inseridas
- [ ] Teste de conectividade realizado
- [ ] Variável NEXT_PUBLIC_API_URL configurada no frontend
