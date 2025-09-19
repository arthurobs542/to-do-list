# 🎯 Focus App - Lista de Tarefas com Timer Pomodoro

Uma aplicação completa de produtividade que combina gestão de tarefas com técnica Pomodoro, desenvolvida com Next.js, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

### 📋 Gestão de Tarefas

- ✅ Criar, editar e excluir tarefas
- 📁 Organizar tarefas por categorias personalizáveis
- 🎯 Marcar tarefas como concluídas
- 📊 Estatísticas de produtividade
- 🔄 Drag and drop para reordenar tarefas

### ⏰ Timer Pomodoro

- 🍅 Timer baseado na técnica Pomodoro (25min trabalho / 5min pausa)
- ⏸️ Controles de play, pause e reset
- 🔄 Alternância automática entre modos (trabalho/pausa)
- ⚙️ Configurações personalizáveis de tempo
- 📈 Contador de pomodoros concluídos
- 🔔 Notificações sonoras (opcional)

### 👤 Perfil do Usuário

- 📊 Estatísticas detalhadas de produtividade
- 🏆 Sistema de conquistas
- ⚙️ Configurações personalizáveis
- 📈 Taxa de conclusão de tarefas
- 🔥 Sequência de dias produtivos

### ⚙️ Configurações Avançadas

- 🌙 Modo escuro/claro
- 🎨 Temas de cores personalizáveis
- 🔔 Configurações de notificações
- 🔊 Controle de volume
- 🌍 Seleção de idioma
- 💾 Exportar/importar dados
- 🔄 Reset de configurações

### 📱 Interface Responsiva

- 📱 Design mobile-first
- 🖥️ Otimizado para desktop
- 🎨 Interface moderna e intuitiva
- 🌈 Gradientes e animações suaves
- 📊 Componentes reutilizáveis

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos
- **Local Storage** - Persistência de dados

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/arthurobs542/focus-app.git
cd focus-app
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Execute o projeto:

```bash
npm run dev
# ou
yarn dev
```

4. Acesse `http://localhost:3000` no seu navegador

## 🎨 Design System

### Cores

- **Primária**: Azul (#3b82f6)
- **Sucesso**: Verde (#10b981)
- **Aviso**: Laranja (#f59e0b)
- **Erro**: Vermelho (#ef4444)
- **Neutro**: Cinza (slate)

### Componentes

- **Cards**: Bordas arredondadas, sombras suaves
- **Botões**: Estados hover e focus bem definidos
- **Inputs**: Bordas e focus rings consistentes
- **Modais**: Overlay com blur e animações

## 📱 Navegação

A aplicação possui uma barra de navegação fixa no canto inferior com 4 seções:

1. **📋 Tarefas** - Gestão de tarefas e categorias
2. **⏰ Timer** - Timer Pomodoro com configurações
3. **👤 Perfil** - Estatísticas e conquistas do usuário
4. **⚙️ Configurações** - Preferências e configurações

## 🔧 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css          # Estilos globais e tema
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
├── components/
│   ├── ui/                  # Componentes base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── Modal.tsx        # Modal reutilizável
│   │   └── StatsCard.tsx    # Card de estatísticas
│   ├── App.tsx              # Componente principal
│   ├── Navigation.tsx       # Barra de navegação
│   ├── TasksList.tsx        # Lista de tarefas
│   ├── PomodoroTimer.tsx    # Timer Pomodoro
│   ├── Profile.tsx          # Perfil do usuário
│   └── Settings.tsx         # Configurações
└── hooks/
    ├── useTheme.ts          # Hook de tema
    └── useTasks.ts          # Hook de tarefas
```

## 🎯 Técnica Pomodoro

A aplicação implementa a técnica Pomodoro com:

- **25 minutos** de trabalho focado
- **5 minutos** de pausa curta
- **15 minutos** de pausa longa (a cada 4 pomodoros)
- **Notificações** para transições
- **Estatísticas** de produtividade

## 💾 Persistência de Dados

Todos os dados são salvos no localStorage do navegador:

- ✅ Tarefas e categorias
- ⚙️ Configurações do usuário
- 📊 Estatísticas de produtividade
- 🎨 Preferências de tema

## 🌟 Próximas Funcionalidades

- [ ] Sincronização em nuvem
- [ ] Relatórios de produtividade
- [ ] Integração com calendário
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Temas personalizados
- [ ] Integração com APIs externas

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido por [Arthur Robson](https://github.com/arthurobs542)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
