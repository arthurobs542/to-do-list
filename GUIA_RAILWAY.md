# 🚀 GUIA COMPLETO: Conectar App com Railway

## 📋 **PASSO A PASSO DETALHADO**

### **PASSO 1: Criar Conta no Railway** ⭐

1. **Acesse**: https://railway.app
2. **Clique em**: "Login" (canto superior direito)
3. **Escolha**: "Continue with GitHub"
4. **Autorize** o Railway no GitHub
5. **Pronto!** Você está logado

---

### **PASSO 2: Criar Projeto** ⭐

1. **Na tela inicial**, clique em **"New Project"**
2. **Escolha**: **"Empty Project"**
3. **Digite o nome**: `focus-app-backend`
4. **Clique em**: "Create Project"

---

### **PASSO 3: Adicionar PostgreSQL (Banco de Dados)** ⭐

1. **No seu projeto**, clique em **"+ New"** (botão azul)
2. **Na lista**, procure por **"Database"**
3. **Clique em**: **"PostgreSQL"**
4. **Aguarde** aparecer "Deployment successful" ✅
5. **Anote** o nome que apareceu (ex: `postgresql-abc123`)

---

### **PASSO 4: Configurar o Banco** ⭐

1. **Clique no PostgreSQL** que você criou
2. **Vá para a aba**: **"Connect"**
3. **Clique em**: **"Query"** ou **"psql"**
4. **Cole e execute** o conteúdo do arquivo `database/railway_setup.sql`
5. **Aguarde** aparecer "Query executed successfully" ✅

---

### **PASSO 5: Adicionar Backend Node.js** ⭐

1. **Volte para o projeto principal**
2. **Clique em**: **"+ New"** novamente
3. **Escolha**: **"GitHub Repo"**
4. **Selecione**: seu repositório do GitHub
5. **Clique em**: "Deploy from GitHub repo"

---

### **PASSO 6: Configurar o Backend** ⭐

1. **Clique no serviço** que foi criado
2. **Vá para**: **"Settings"**
3. **Na seção "Variables"**, adicione:
   ```
   NODE_ENV=production
   ```
4. **Clique em**: "Add Variable"

---

### **PASSO 7: Fazer Deploy** ⭐

1. **Volte para**: **"Deployments"**
2. **Clique em**: **"Deploy"**
3. **Aguarde** aparecer "Deployment successful" ✅
4. **Clique na URL** que apareceu (ex: `https://abc123.railway.app`)

---

### **PASSO 8: Testar a API** ⭐

1. **Abra** a URL do backend no navegador
2. **Você deve ver**: uma página com informações da API
3. **Teste**: adicione `/api/health` no final da URL
4. **Deve aparecer**: `{"status":"OK","message":"Focus App Backend está funcionando!"}`

---

### **PASSO 9: Configurar Frontend** ⭐

1. **No seu computador**, abra o projeto Next.js
2. **Na pasta raiz**, crie um arquivo chamado `.env.local`
3. **Cole dentro**:
   ```
   NEXT_PUBLIC_API_URL=https://sua-url-aqui.railway.app
   ```
   (Substitua pela URL real do seu backend)

---

### **PASSO 10: Testar Tudo** ⭐

1. **No terminal**, pare o servidor (Ctrl+C)
2. **Execute**: `npm run dev`
3. **Abra**: http://localhost:3001
4. **Vá para**: aba "Perfil"
5. **Deve funcionar** sem erros!

---

## 🆘 **SE ALGO DER ERRADO**

### ❌ **Problema**: Não consigo criar conta

**Solução**: Use GitHub para login, é mais fácil

### ❌ **Problema**: PostgreSQL não funciona

**Solução**: Aguarde mais alguns minutos, pode demorar

### ❌ **Problema**: Deploy falha

**Solução**: Verifique se todos os arquivos estão na pasta `backend/`

### ❌ **Problema**: API não responde

**Solução**: Verifique se a URL está correta no `.env.local`

### ❌ **Problema**: Banco não conecta

**Solução**: Execute novamente o `railway_setup.sql`

---

## 📞 **PRECISA DE AJUDA?**

Se você travar em algum passo:

1. **Tire print** da tela
2. **Me mande** qual passo você está
3. **Descreva** o que está acontecendo
4. **Vou te ajudar** a resolver!

---

## ✅ **CHECKLIST FINAL**

- [ ] Conta criada no Railway
- [ ] Projeto criado
- [ ] PostgreSQL adicionado
- [ ] Banco configurado
- [ ] Backend deployado
- [ ] API funcionando
- [ ] Frontend configurado
- [ ] Tudo conectado!

**🎉 PARABÉNS! Seu app está conectado ao Railway!**
