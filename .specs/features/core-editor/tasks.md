# Tasks: Editor Colaborativo Local-First

## Fase 1: Setup da Infraestrutura
- [x] Tarefa 1.1: Inicializar projeto frontend (React + Vite + TS) em `frontend/` e configurar TailwindCSS.
- [x] Tarefa 1.2: Inicializar projeto backend local (Node.js + TS) em `backend/` com `y-websocket` puro atuando como relay server.

## Fase 2: Implementação do Editor Local-First (Offline & Persistência)
- [x] Tarefa 2.1: Instalar dependências core no frontend (`yjs`, `y-indexeddb`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-collaboration`).
- [x] Tarefa 2.2: Criar o componente UI base do `Editor.tsx` integrando o Tiptap.
- [x] Tarefa 2.3: Injetar o documento Yjs (`Y.Doc`) no Tiptap usando o plugin de colaboração.
- [x] Tarefa 2.4: Ativar o `y-indexeddb` no `Y.Doc` para gravar as mudanças no navegador e comprovar persistência no refresh (F5).

## Fase 3: Sincronização Real-time e Awareness
- [x] Tarefa 3.1: Ativar a conexão via WebSocket usando o `y-websocket` no frontend, conectando ao relay local.
- [x] Tarefa 3.2: Implementar módulo de Awareness (cursores remotos coloridos e tags com os nomes dos usuários) usando `@tiptap/extension-collaboration-cursor`.
- [x] Tarefa 3.3: Adicionar indicador visual de status de rede (Online/Offline) no cabeçalho do App.
