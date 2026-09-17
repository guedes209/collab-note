# Tasks: WebRTC (Peer-to-Peer Puro)

## Fase 1: Transição do Provider de Rede
- [x] Tarefa 1.1: Instalar as dependências de rede P2P no frontend (`npm install y-webrtc`).
- [x] Tarefa 1.2: No `Editor.tsx`, substituir o `WebsocketProvider` pelo `WebrtcProvider`, mantendo a configuração do `roomId`.
- [x] Tarefa 1.3: Atualizar a lógica de `useEffect` para gerenciar a destruição correta do novo provedor, garantindo a solidez do React Strict Mode construída na feature anterior.

## Fase 2: Painel de Conexão e Awareness
- [x] Tarefa 2.1: Modificar o hook de escuta de eventos de rede (`provider.on('synced')` ou equivalente no `WebrtcProvider`) para exibir quando uma conexão P2P for efetivada na interface.
- [x] Tarefa 2.2: Atualizar os status visuais no UI do editor para refletir o número de `peers` (nós P2P) conectados na sala atual.
- [x] Tarefa 2.3: Testar com duas abas em navegadores diferentes, ou aba anônima, e desligar o servidor Node local para comprovar que o sistema P2P funciona sem o backend ativo.

