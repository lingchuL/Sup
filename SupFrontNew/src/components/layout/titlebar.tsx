"use client"

export function Titlebar() {
  const handleMinimize = () => window.electronAPI?.minimizeWindow?.()
  const handleMaximize = () => window.electronAPI?.maximizeWindow?.()
  const handleClose = () => window.electronAPI?.closeWindow?.()
  const handleNewWindow = () => window.electronAPI?.newWindow?.("copiper_s")

  return (
    <div
      className="h-[var(--cp-titlebar-height)] bg-[var(--cp-bg-base)] border-b border-[var(--cp-border-subtle)] flex items-center px-3 electron-dragable relative z-50"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 text-[12px] font-bold tracking-wider uppercase text-[var(--cp-text-secondary)]">
        <div className="w-4 h-4 bg-[var(--cp-accent)] rounded-[3px] flex items-center justify-center text-[9px] font-extrabold text-white">
          C
        </div>
        COPIPER
      </div>

      {/* Window Controls */}
      <div className="ml-auto flex gap-0.5 electron-undragable">
        <TitleButton onClick={handleNewWindow} title="新窗口">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </TitleButton>
        <TitleButton onClick={handleMinimize} title="最小化">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </TitleButton>
        <TitleButton onClick={handleMaximize} title="最大化">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="5" width="14" height="14" rx="1" /></svg>
        </TitleButton>
        <TitleButton onClick={handleClose} title="关闭" className="hover:!bg-[var(--cp-error)] hover:!text-white">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </TitleButton>
      </div>
    </div>
  )
}

function TitleButton({ children, onClick, title, className = "" }: {
  children: React.ReactNode; onClick?: () => void; title?: string; className?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-[22px] flex items-center justify-center border-none bg-transparent text-[var(--cp-text-tertiary)] cursor-pointer rounded hover:bg-[var(--cp-bg-hover)] hover:text-[var(--cp-text-secondary)] transition-all duration-100 ${className}`}
    >
      {children}
    </button>
  )
}

// Extend window for Electron API
declare global {
  interface Window {
    electronAPI?: {
      closeWindow: () => void
      minimizeWindow: () => void
      maximizeWindow: () => void
      newWindow: (page: string) => void
      moveWindow: (x: number, y: number) => void
    }
  }
}
