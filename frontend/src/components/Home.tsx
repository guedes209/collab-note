import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

export function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const newRoomId = uuidv4()
    // Redireciona para uma sala nova gerada
    navigate(`/doc/${newRoomId}`, { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Criando uma nova sala...</h2>
        <p className="text-gray-500">Você será redirecionado em instantes.</p>
      </div>
    </div>
  )
}

