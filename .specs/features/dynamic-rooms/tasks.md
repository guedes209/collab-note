# Tasks: Salas Dinâmicas e Múltiplos Documentos

## Fase 1: Roteamento e Inicialização
- [x] Tarefa 1.1: Instalar dependências de roteamento no frontend (`npm install react-router-dom uuid` e `@types/uuid`).
- [x] Tarefa 1.2: Refatorar o `App.tsx` para incluir o `BrowserRouter`, configurando as rotas `/` (Redirecionamento) e `/doc/:roomId` (Renderiza o `Editor`).
- [x] Tarefa 1.3: Criar componente `Home.tsx` na rota raiz que gera um `uuid` e faz o push da rota para a nova sala.

## Fase 2: Isolamento do CRDT e Ciclo de Vida
- [x] Tarefa 2.1: Modificar o `Editor.tsx` para aceitar a prop `roomId` da URL (através de hook do React Router).
- [x] Tarefa 2.2: Atualizar os identificadores do `IndexeddbPersistence` e do provedor de rede para concatenar o `roomId` (ex: `collab-note-doc-${roomId}`).
- [x] Tarefa 2.3: Implementar a destruição apropriada (`doc.destroy()` e `provider.destroy()`) no `useEffect` cleanup (gerenciando corretamente o Strict Mode sem vazar memória).

