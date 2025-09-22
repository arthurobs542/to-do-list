# Focus App Backend

Backend simples para o Focus App usando Express.js e PostgreSQL.

## 🚀 Como Fazer Deploy no Railway

### 1. Criar Projeto no Railway

1. **Acesse**: [railway.app](https://railway.app)
2. **Faça login** com GitHub
3. **Clique em**: "New Project"
4. **Escolha**: "Empty Project"

### 2. Adicionar PostgreSQL

1. **No projeto**, clique em **"+ New"**
2. **Escolha**: **"Database"** → **"PostgreSQL"**
3. **Aguarde** a criação (pode demorar alguns minutos)

### 3. Adicionar Node.js

1. **Clique em**: **"+ New"**
2. **Escolha**: **"GitHub Repo"**
3. **Conecte** este repositório
4. **Ou faça upload** dos arquivos manualmente

### 4. Configurar Banco de Dados

1. **Clique no PostgreSQL**
2. **Vá para**: "Query" ou "Connect"
3. **Execute** o arquivo `database/railway_setup.sql`

### 5. Configurar Variáveis

No Railway, vá em **"Variables"** e adicione:

```
NODE_ENV=production
PORT=3000
```

A `DATABASE_URL` será configurada automaticamente.

### 6. Fazer Deploy

1. **Clique em**: "Deploy"
2. **Aguarde** o deploy (alguns minutos)
3. **Copie** a URL gerada

### 7. Configurar Frontend

No seu projeto Next.js, crie `.env.local`:

```
NEXT_PUBLIC_API_URL=https://sua-url-aqui.railway.app
```

## 🧪 Testar a API

### Health Check

```
GET https://sua-url.railway.app/api/health
```

### Criar Usuário

```
POST https://sua-url.railway.app/api/users
{
  "id": "user_123",
  "profile": {
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Buscar Usuário

```
GET https://sua-url.railway.app/api/users/user_123
```

## 📁 Estrutura

```
backend/
├── server.js          # Servidor principal
├── package.json       # Dependências
└── README.md         # Este arquivo
```

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Executar
npm run dev
```
