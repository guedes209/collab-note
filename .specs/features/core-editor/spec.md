# Feature: Editor Colaborativo Local-First

## Especificação de Requisitos (EARS)
- **UBIQUITOUS**: O sistema deve permitir que o usuário digite texto em um documento rico (suporte a negrito, itálico, cabeçalhos e listas).
- **EVENT-DRIVEN**: Quando o usuário alterar o documento, o sistema deve salvar o estado imediatamente no banco IndexedDB local do navegador.
- **STATE-DRIVEN**: Enquanto o usuário estiver offline, o sistema deve continuar permitindo a edição e leitura normais do documento, sem bloqueios.
- **EVENT-DRIVEN**: Quando a conexão com o WebSocket local for estabelecida/restabelecida, o sistema deve sincronizar as mudanças locais com o servidor e resolver eventuais conflitos matematicamente via algoritmos CRDT.
- **EVENT-DRIVEN**: Quando múltiplos usuários editarem o documento simultaneamente, o sistema deve exibir os cursores remotos dos outros usuários em tempo real na tela.

## Critérios de Aceite
1. Deve ser possível abrir a aplicação frontend, desligar o servidor backend, e ainda assim continuar editando o texto normalmente.
2. Ao atualizar a página (F5) com o backend desligado, o texto digitado anteriormente deve ser mantido (prova da persistência no IndexedDB).
3. Ao abrir uma segunda aba do navegador (Cliente B) e ligar o backend, ambas as abas devem ter os textos fundidos sem perda de dados.
4. Alterações feitas na mesma linha por dois clientes simultaneamente não devem corromper o texto, mas sim resolvê-las deterministicamente.
5. Cada usuário conectado deve ter uma cor única e seu nome/cursor renderizado na tela do outro usuário.
