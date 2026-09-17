# Case de Estudo: Arquitetura do CollabNote

Este documento detalha as principais decisões arquiteturais, desafios técnicos resolvidos e as tecnologias inovadoras aplicadas no desenvolvimento do **CollabNote**, um editor de texto colaborativo moderno. Ele serve como um guia profundo para recrutadores e desenvolvedores entenderem o nível de engenharia por trás do projeto.

---

## 1. Local-First e Sincronização CRDT (Yjs)
Ao contrário das aplicações tradicionais (Cloud-First) onde o banco de dados é a "fonte da verdade" e cada tecla digitada faz uma requisição HTTP, o CollabNote é **Local-First**. A fonte primária da verdade é o próprio navegador do usuário.

Para garantir que múltiplos usuários editem o mesmo documento sem gerar conflitos de sobrescrita, utilizamos **CRDTs** (Conflict-free Replicated Data Types) através da biblioteca `Yjs`.

### Exemplo no Código
No nosso sistema, injetamos a estrutura de dados matemática (`Y.Doc`) diretamente no motor do editor (Tiptap):
```tsx
// 1. O Documento nasce offline na memória do navegador
const doc = new Y.Doc()

// 2. O editor recebe o documento matemático 
const editor = useEditor({
  extensions: [
    Collaboration.configure({
      document: doc, // Conecta o Tiptap ao Yjs
    }),
  ]
})
```

---

## 2. Persistência Offline Absoluta (IndexedDB)
Por ser Local-First, o aplicativo tem resiliência total a quedas de internet. Se o usuário estiver no avião ou em um túnel, ele pode abrir o editor, digitar páginas de conteúdo, fechar a aba e nada será perdido.

Isso é feito "pluggando" um provedor de persistência local que grava as mutações binárias do CRDT diretamente no banco embutido do navegador (`IndexedDB`).

### Exemplo no Código
O buffer do documento é mantido salvo a cada caractere digitado:
```tsx
import { IndexeddbPersistence } from 'y-indexeddb'

// Atrelamos o provedor de banco local ao Documento Yjs
const idbProvider = new IndexeddbPersistence(`collab-note-doc-${roomId}`, doc)

// Escutamos o evento de sincronização para atualizar a UI
idbProvider.on('synced', () => {
  setLocalStatus('Carregado (IndexedDB)')
})
```

---

## 3. Topologia Descentralizada P2P (WebRTC)
Sistemas de colaboração padrão (como o Google Docs) dependem de pesados servidores centrais (WebSocket) recebendo e repassando o estado para todos os usuários em tempo real, o que gera alto custo de nuvem e gargalos.

Nós inovamos substituindo a estrela de servidores por uma malha **Peer-to-Peer (P2P)**. Usando `y-webrtc`, o backend atua apenas como um "garçom" de sinalização (apresentando um IP para o outro). A partir desse momento, as teclas fluem diretamente do Navegador A para o Navegador B via WebRTC, com latência incrivelmente menor e custo de infraestrutura próximo de zero.

### Exemplo no Código
```tsx
import { WebrtcProvider } from 'y-webrtc'

// Troca transparente de servidor central para malha P2P
const webrtcProvider = new WebrtcProvider(`collab-note-doc-${roomId}`, doc)

// Lendo a entrada/saída de usuários em tempo real pela malha conectada
webrtcProvider.awareness.on('change', () => {
  const connectedPeers = webrtcProvider.awareness.getStates().size
  setNetworkStatus(`${connectedPeers} peer(s)`)
})
```

---

## 4. Domínio sobre Ciclo de Vida do React e Strict Mode
Gerenciar instâncias mutáveis (classes cruas que precisam ser instanciadas e destruídas, como Websockets e CRDTs) dentro de um ambiente funcional moderno do React é um dos maiores desafios de arquitetura no ecossistema atual.

Durante o desenvolvimento, o **React Strict Mode** expôs falhas de memory leak, onde instanciar provedores fora de um `useEffect` mantinha conexões presas na memória após a desmontagem do componente. 

Resolvemos o problema criando um padrão de **Componente Wrapper**. O componente pai prepara a infraestrutura e apenas quando o `Y.Doc` estiver hidratado, injetamos ele no componente filho (`EditorRoom`). Na desmontagem (quando o usuário troca de sala de URL), garantimos a destruição cirúrgica das pontes P2P e do IndexedDB sem quebrar a UI.

### Exemplo no Código
```tsx
export function Editor() {
  const { roomId } = useParams<{ roomId: string }>()
  const [yState, setYState] = useState<{ doc: Y.Doc, /* providers */ } | null>(null)

  useEffect(() => {
    // 1. Prepara a infraestrutura dentro do clico seguro do efeito
    const doc = new Y.Doc()
    const idbProvider = new IndexeddbPersistence(`collab-note-doc-${roomId}`, doc)
    const webrtcProvider = new WebrtcProvider(`collab-note-doc-${roomId}`, doc)
    
    setYState({ doc, idbProvider, webrtcProvider })

    return () => {
      // 2. Destruição garantida no unmount, impedindo memory leaks
      idbProvider.destroy()
      webrtcProvider.destroy()
      doc.destroy()
    }
  }, [roomId])

  // 3. Trava de Renderização: Protege o useEditor de inicializar sem o Documento
  if (!yState) return <Loading />

  // 4. Injeção segura do estado arquitetural
  return <EditorRoom roomId={roomId} yState={yState} />
}
```

---

> Esse case mostra domínio não apenas em ferramentas (React, Tailwind), mas em conceitos estruturais densos: Concorrência de dados (CRDT), Redes (WebRTC), Sistemas Distribuídos e Ciclo de Vida em memórias não-gerenciadas.
