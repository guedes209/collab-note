# Arquitetura: CollabNote (Local-First Collaborative Editor)

## Visão Geral
Aplicação de edição de texto colaborativa baseada na arquitetura Local-First. O estado da aplicação vive primordialmente no cliente, garantindo funcionamento offline ininterrupto. A sincronização com outros clientes ocorre de forma otimista e descentralizada quando há conexão, fundindo edições matematicamente.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, TailwindCSS.
- **Core do Editor**: Tiptap (Headless wrapper para ProseMirror).
- **Gerenciamento de Estado Distribuído**: Yjs (CRDT - Conflict-free Replicated Data Type).
- **Persistência Local**: IndexedDB (via `y-indexeddb`).
- **Rede / Sincronização (LocalBackend)**: Servidor Node.js simples rodando WebSockets (via `y-websocket`).

## Topologia Local-First
1. **Cliente A (Offline)**: Edita o documento. As alterações são registradas pelo Yjs e salvas instantaneamente no IndexedDB do navegador.
2. **Reconexão**: Cliente A se conecta ao servidor WebSocket local. O servidor atua apenas como um "relay" (repassador de mensagens).
3. **Cliente B**: Conecta ao servidor e recebe o delta das atualizações do Cliente A. O algoritmo CRDT do Yjs resolve os conflitos e mantém ambos em perfeita sincronia, incluindo a exibição de cursores de texto.
