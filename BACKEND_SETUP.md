# Configuração do Backend Railway

Este documento explica como configurar a integração com o backend Railway para o app de tarefas.

## Configuração do Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-app-name.railway.app

# Para desenvolvimento local
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

2. Substitua `your-app-name` pela URL real do seu backend Railway.

## Estrutura da API

O app espera que o backend tenha os seguintes endpoints:

### GET `/api/users/:userId`

Retorna os dados do usuário (perfil e configurações).

**Resposta esperada:**

```json
{
  "profile": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string",
    "joinDate": "string",
    "totalTasks": "number",
    "completedTasks": "number",
    "pomodorosCompleted": "number",
    "streak": "number",
    "achievements": [...]
  },
  "settings": {
    "notifications": "boolean",
    "soundEnabled": "boolean",
    "pomodoroNotifications": "boolean",
    "taskReminders": "boolean",
    "autoSave": "boolean",
    "theme": "string",
    "language": "string",
    "volume": "number"
  }
}
```

### POST `/api/users`

Cria um novo usuário.

**Body:**

```json
{
  "id": "string",
  "profile": {...},
  "settings": {...}
}
```

### PATCH `/api/users/:userId`

Atualiza os dados do usuário.

**Body:**

```json
{
  "profile": {...},
  "settings": {...}
}
```

## Funcionalidades Implementadas

- ✅ Sincronização automática com o backend
- ✅ Fallback para localStorage quando o backend não está disponível
- ✅ Atualização das estatísticas em tempo real
- ✅ Sistema de conquistas
- ✅ Configurações globais de tema e notificações
- ✅ Persistência de dados do usuário

## Fallback Offline

O app funciona completamente offline usando localStorage como fallback. Quando o backend estiver disponível, os dados serão sincronizados automaticamente.

## 🗄️ Configuração do Banco de Dados

Para configurar o banco PostgreSQL no Railway, consulte a documentação completa em:

- `database/README.md` - Guia completo de configuração
- `database/railway_setup.sql` - Setup automático
- `database/schema.sql` - Schema completo
- `database/functions.sql` - Funções auxiliares

### Setup Rápido do Banco

1. **Criar PostgreSQL no Railway**
2. **Executar o setup**:
   ```bash
   railway run psql -f database/railway_setup.sql
   ```
3. **Configurar variável de ambiente**:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-app-name.railway.app
   ```

### Estrutura do Banco

O banco inclui as seguintes tabelas:

- `users` - Usuários do sistema
- `user_profiles` - Perfis e estatísticas
- `user_settings` - Configurações personalizadas
- `achievements` - Conquistas disponíveis
- `user_achievements` - Conquistas dos usuários

### Funções Disponíveis

- `create_user_complete()` - Criar usuário completo
- `get_user_complete()` - Buscar dados do usuário
- `update_user_profile()` - Atualizar perfil
- `update_user_settings()` - Atualizar configurações
- `unlock_achievement()` - Desbloquear conquistas
