# Feature: Salas Dinâmicas e Múltiplos Documentos (Dynamic Rooms)

## 1. Escopo e Propósito
Permitir que o sistema gerencie múltiplos documentos independentes de texto, separando o estado do Yjs através do roteamento da aplicação. Isso transforma o projeto de um simples "bloco de notas global" para uma plataforma onde usuários podem gerar e compartilhar links únicos de documentos.

## 2. Especificação EARS (Requisitos Testáveis)

- **[E]** O sistema DEVE utilizar o `react-router-dom` para gerenciar a URL da aplicação.
- **[A]** QUANDO o usuário acessar a rota raiz (`/`), o sistema DEVE gerar um UUID único e redirecionar imediatamente o usuário para `/doc/<uuid>`.
- **[A]** QUANDO o usuário acessar a rota `/doc/<id>`, o sistema DEVE instanciar o componente `Editor` injetando o `<id>` como chave para o documento Yjs (`Y.Doc`).
- **[A]** QUANDO o componente `Editor` for desmontado (ex: o usuário trocou de sala), o sistema DEVE obrigatoriamente chamar o método `.destroy()` nos provedores (`IndexeddbPersistence` e de Rede) para evitar vazamento de memória e sobreposição de conexões.
- **[R]** ENQUANTO o usuário estiver em uma sala `/doc/X`, ele NÃO DEVE receber atualizações de cursores ou de texto dos usuários que estão na sala `/doc/Y`.

## 3. Arquitetura
O estado do CRDT será atrelado à propriedade `roomName`.
- IndexedDB usará o formato: `collab-note-doc-<id>`
- O Provedor de Rede conectará usando o canal: `collab-note-doc-<id>`

