import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

export function Editor() {
  const [status, setStatus] = useState('conectando...')
  
  // Create doc and provider only once
  const [doc] = useState(() => new Y.Doc())
  const [provider] = useState(() => new IndexeddbPersistence('collab-note-doc', doc))

  useEffect(() => {
    provider.on('synced', () => {
      setStatus('Carregado do IndexedDB (Offline Ready)')
    })

    return () => {
      // Evitamos destroy() aqui por causa do React Strict Mode que desmonta e monta novamente
    }
  }, [provider, doc])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: false, 
      }),
      Collaboration.configure({
        document: doc,
      }),
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
        <span className="text-sm font-semibold text-gray-700">Status Local:</span>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
          {status}
        </span>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  )
}

