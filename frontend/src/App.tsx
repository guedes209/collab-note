import { Routes, Route } from 'react-router-dom'
import { Editor } from './components/Editor'
import { Home } from './components/Home'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/doc/:roomId" element={
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">CollabNote</h1>
            <p className="text-gray-500">Editor colaborativo local-first pronto para iniciar.</p>
          </div>
          
          <div className="w-full max-w-4xl">
            <Editor />
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App
