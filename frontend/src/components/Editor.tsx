import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'

const colors = ['#f783ac', '#8ce99a', '#74c0fc', '#ffa94d', '#d0bfff']
const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']

export function Editor() {
  const { roomId } = useParams<{ roomId: string }>()
  const [yState, setYState] = useState<{
    doc: Y.Doc,
    idbProvider: IndexeddbPersistence,
    webrtcProvider: WebrtcProvider
  } | null>(null)

  useEffect(() => {
    if (!roomId) return

    const doc = new Y.Doc()
    const idbProvider = new IndexeddbPersistence(`collab-note-doc-${roomId}`, doc)
    
    // WebrtcProvider conecta diretamente no browser dos outros usuários!
    // Ele usa servidores de sinalização públicos por padrão.
    const webrtcProvider = new WebrtcProvider(`collab-note-doc-${roomId}`, doc)
    
    // eslint-disable-next-line
    setYState({ doc, idbProvider, webrtcProvider })

    return () => {
      idbProvider.destroy()
      webrtcProvider.destroy()
      doc.destroy()
      setYState(null)
    }
  }, [roomId])

  if (!yState || !roomId) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        Carregando sala {roomId}...
      </div>
    )
  }

  return <EditorRoom roomId={roomId} yState={yState} />
}

function EditorRoom({ roomId, yState }: { roomId: string, yState: { doc: Y.Doc, idbProvider: IndexeddbPersistence, webrtcProvider: WebrtcProvider } }) {
  const [localStatus, setLocalStatus] = useState('conectando DB...')
  const [networkStatus, setNetworkStatus] = useState('conectando P2P...')
  
  const [user] = useState(() => ({
    name: names[Math.floor(Math.random() * names.length)],
    color: colors[Math.floor(Math.random() * colors.length)]
  }))

  useEffect(() => {
    const handleSynced = () => setLocalStatus('Carregado (IndexedDB)')
    const handlePeers = () => {
      // WebrtcProvider não emite 'status' como o websocket, mas tem 'peers'
      const connectedPeers = yState.webrtcProvider.awareness.getStates().size
      setNetworkStatus(`${connectedPeers} peer(s)`)
    }

    yState.idbProvider.on('synced', handleSynced)
    // Para y-webrtc, awareness changes nos indicam quando novos peers chegam
    yState.webrtcProvider.awareness.on('change', handlePeers)
    handlePeers() // call immediately

    return () => {
      yState.idbProvider.off('synced', handleSynced)
      yState.webrtcProvider.awareness.off('change', handlePeers)
    }
  }, [yState])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, 
      }),
      Collaboration.configure({
        document: yState.doc,
      }),
      CollaborationCursor.configure({
        provider: yState.webrtcProvider,
        user: user,
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4 bg-white border border-gray-200 shadow-sm rounded-lg',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
        <span className="text-sm font-semibold text-gray-700">Sala: <span className="text-gray-500 font-normal">{roomId.substring(0, 8)}...</span> | DB: <span className="text-gray-500 font-normal">{localStatus}</span></span>
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
          Rede P2P: {networkStatus}
        </span>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  )
}

