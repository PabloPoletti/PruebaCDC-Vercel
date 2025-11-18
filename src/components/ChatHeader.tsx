import Image from 'next/image'

export default function ChatHeader() {
  return (
    <header className="bg-cdc-dark-green text-white px-4 py-3 shadow-md flex items-center gap-3">
      {/* Logo del CDC */}
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">🏥</span>
      </div>
      
      {/* Información */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold truncate">Centro de Día Comunitario</h1>
        <p className="text-xs text-green-200 truncate">25 de Mayo - La Pampa</p>
      </div>

      {/* Indicador en línea */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-200">En línea</span>
      </div>
    </header>
  )
}

