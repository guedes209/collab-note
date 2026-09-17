import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket'

const colors = ['#f783ac', '#8ce99a', '#74c0fc', '#ffa94d', '#d0bfff']
const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']

export function Editor() {
  const [localStatus, setLocalStatus] = useState('conectando DB...')
  const [networkStatus, setNetworkStatus] = useState('conectando WS...')
  
  // Random user info initialized safely
  const [user] = useState(() => ({
    name: names[Math.floor(Math.random() * names.length)],
    color: colors[Math.floor(Math.random() * colors.length)]
  }))

  // Create doc and provider only once
  const [doc] = useState(() => new Y.Doc())
  const [idbProvider] = useState(() => new IndexeddbPersistence('collab-note-doc', doc))
  const [wsProvider] = useState(() => new WebsocketProvider('ws://localhost:1234', 'collab-note-doc', doc))

  useEffect(() => {
    idbProvider.on('synced', () => {
      setLocalStatus('Carregado (IndexedDB)')
    })

    wsProvider.on('status', (event: { status: string }) => {
      setNetworkStatus(event.status === 'connected' ? 'Online' : 'Offline')
    })

    return () => {
      // Evitamos destroy() no modo de dev do React Strict Mode para não perder o doc
      // Na produção seria seguro destruir ao desmontar
    }
  }, [idbProvider, wsProvider])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: false, 
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider: wsProvider,
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
    return <div>Carregando editor...</div>
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
        <span className="text-sm font-semibold text-gray-700">Status Local: <span className="text-gray-500 font-normal">{localStatus}</span></span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${networkStatus === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          WS: {networkStatus}
        </span>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  )
}

