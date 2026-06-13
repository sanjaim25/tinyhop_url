import { useState, useEffect, useRef } from 'react'

export default function CommandPalette({ isOpen, onClose, onSelectAction, urls = [] }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Key navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, search])

  const navigationItems = [
    { type: 'nav', label: 'Go to Dashboard', action: 'dashboard', icon: '📊' },
    { type: 'nav', label: 'Go to Link Manager', action: 'links', icon: '🔗' },
    { type: 'nav', label: 'Go to Analytics Engine', action: 'analytics', icon: '📈' },
    { type: 'nav', label: 'Go to QR Code Studio', action: 'qr', icon: '🔲' },
    { type: 'nav', label: 'Go to Link-in-Bio Builder', action: 'bio', icon: '📱' },
    { type: 'nav', label: 'Go to UTM Campaigns', action: 'campaigns', icon: '🎯' },
    { type: 'nav', label: 'Go to AI workspace Co-pilot', action: 'ai', icon: '🧠' },
    { type: 'nav', label: 'Go to Developer API Keys', action: 'api', icon: '⚙️' },
    { type: 'nav', label: 'Go to Workspaces Settings', action: 'team', icon: '👥' },
    { type: 'nav', label: 'Go to Branded Domains', action: 'domains', icon: '🌐' },
    { type: 'nav', label: 'Go to Settings', action: 'settings', icon: '🛠️' },
  ]

  const urlItems = urls.map((u) => ({
    type: 'url',
    label: u.customAlias || u.shortCode,
    subtitle: u.originalUrl,
    action: `url-${u.id}`,
    icon: '🔗'
  }))

  const allItems = [...navigationItems, ...urlItems]

  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSelect = (item) => {
    if (item.type === 'nav') {
      onSelectAction(item.action)
    } else if (item.type === 'url') {
      onSelectAction(`analytics-${item.action.replace('url-', '')}`)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
          <span className="text-xl text-zinc-500">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command or link alias..."
            className="w-full bg-transparent border-0 outline-none text-zinc-200 placeholder-zinc-500 text-base font-mono-style"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[350px] overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <div className="py-14 text-center text-zinc-500 text-sm font-mono-style">
              No matching commands or links found
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.action + idx}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between text-left px-5 py-3.5 transition-colors ${
                    isSelected ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                        {item.label}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs text-zinc-500 truncate max-w-[400px]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.type === 'nav' ? (
                    <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase border border-zinc-800 px-1.5 py-0.5 rounded">
                      Action
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-medium text-indigo-400 uppercase border border-indigo-950 bg-indigo-950/20 px-1.5 py-0.5 rounded">
                      Link
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/40 px-5 py-3 text-xs text-zinc-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 font-mono-style">
              <kbd className="bg-zinc-850 px-1 py-0.5 border border-zinc-700 rounded text-[10px] font-bold">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1 font-mono-style">
              <kbd className="bg-zinc-850 px-1 py-0.5 border border-zinc-700 rounded text-[10px] font-bold">↵</kbd> Select
            </span>
          </div>
          <span className="font-mono-style text-[10px] text-zinc-600">LinkForge Console v1.0</span>
        </div>
      </div>
    </div>
  )
}




