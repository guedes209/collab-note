import { Editor } from './components/Editor'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">CollabNote</h1>
        <p className="text-gray-500">Editor colaborativo local-first pronto para iniciar.</p>
      </div>
      
      <div className="w-full max-w-4xl">
        <Editor />
      </div>
    </div>
  )
}

export default App
