# Feature: Sincronização WebRTC (Peer-to-Peer Puro)

## 1. Escopo e Propósito
Descentralizar a infraestrutura de sincronização substituindo o fluxo de dados do `y-websocket` (cliente ↔ servidor ↔ cliente) pelo `y-webrtc` (cliente ↔ cliente). O objetivo é provar a capacidade do Yjs de funcionar em malhas de rede descentralizadas, usando servidores de sinalização (públicos ou dedicados) apenas para apresentar os pares, enquanto os cursores e textos trafegam diretamente entre os navegadores.

## 2. Especificação EARS (Requisitos Testáveis)

- **[E]** O sistema DEVE utilizar a biblioteca `y-webrtc` no frontend.
- **[A]** QUANDO o usuário abrir uma sala (`/doc/<uuid>`), o sistema DEVE instanciar o `WebrtcProvider` associado ao `<uuid>`, substituindo ou coexistindo com o `WebsocketProvider`.
- **[A]** QUANDO a conexão WebRTC for estabelecida entre duas abas/browsers, o sistema DEVE atualizar o status de rede para refletir os pares (peers) conectados.
- **[R]** ENQUANTO o WebRTC estiver ativo, as mudanças de cursor e documento DEVEM trafegar sem intermédio de payload do backend Node.js.
- **[E]** O sistema DEVE utilizar servidores de sinalização padrão do ecossistema Yjs para viabilizar a conexão P2P sem necessidade de desenvolver um servidor de sinalização ICE/STUN próprio do zero (podemos usar os servidores públicos de teste do `y-webrtc` ou rodar o nosso próprio *signaling server* fornecido pela lib).

## 3. Arquitetura
- Frontend: Substituição do import `y-websocket` por `y-webrtc` no `Editor.tsx`.
- Signaling: Vamos utilizar a funcionalidade *signaling* out-of-the-box (padrão) do pacote `y-webrtc`.
- Awarenes: Continuará sendo injetado no Tiptap da mesma forma (o protocolo de awareness do Yjs é agnóstico ao provedor de rede).
