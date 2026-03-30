"use client"

import React, { useState, useRef, useEffect, createContext, useContext, useCallback } from "react"
import { createPortal } from "react-dom"
import { clsx } from "clsx"

// ═══════════════════════════════════════
// Button
// ═══════════════════════════════════════
type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "link"
type ButtonSize = "default" | "sm" | "icon"

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-[var(--cp-accent)] text-white hover:bg-[var(--cp-accent-hover)] border-transparent",
  outline: "border-[var(--cp-border-default)] bg-white text-[var(--cp-text-primary)] hover:bg-[var(--cp-bg-hover)]",
  ghost: "border-transparent bg-transparent text-[var(--cp-text-secondary)] hover:bg-[var(--cp-bg-hover)]",
  destructive: "bg-[var(--cp-error)] text-white hover:opacity-90 border-transparent",
  link: "border-transparent bg-transparent text-[var(--cp-accent)] hover:underline p-0 h-auto",
}

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-8 px-3 text-[12.5px]",
  sm: "h-7 px-2.5 text-[11.5px]",
  icon: "h-8 w-8 p-0",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant = "default", size = "default", className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-md border font-medium transition-all cursor-pointer whitespace-nowrap select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant], sizeStyles[size], className
      )}
      disabled={disabled}
      {...props}
    />
  )
}

// ═══════════════════════════════════════
// Input
// ═══════════════════════════════════════
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "h-8 w-full rounded-md border border-[var(--cp-border-default)] bg-white px-3 text-[13px] outline-none",
      "placeholder:text-[var(--cp-text-tertiary)]",
      "focus:border-[var(--cp-accent)] focus:ring-1 focus:ring-[var(--cp-accent)]/30",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"

// ═══════════════════════════════════════
// Label
// ═══════════════════════════════════════
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx("text-[12px] font-medium text-[var(--cp-text-secondary)]", className)} {...props} />
}

// ═══════════════════════════════════════
// Modal
// ═══════════════════════════════════════
interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onOpenChange, children, className }: ModalProps) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div className={clsx(
        "relative bg-white rounded-xl border border-[var(--cp-border-default)] shadow-xl p-6 max-h-[85vh] overflow-y-auto",
        "animate-in fade-in-0 zoom-in-95",
        className ?? "w-[420px]"
      )}>
        {children}
      </div>
    </div>,
    document.body
  )
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[16px] font-bold text-[var(--cp-text-primary)] mb-4">{children}</h2>
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-[var(--cp-border-subtle)]">{children}</div>
}

// ═══════════════════════════════════════
// Sheet (Side Panel)
// ═══════════════════════════════════════
interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  side?: "right" | "left"
  width?: string
}

export function Sheet({ open, onOpenChange, children, title, side = "right", width = "500px" }: SheetProps) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[500] flex">
      <div className="absolute inset-0 bg-black/20" onClick={() => onOpenChange(false)} />
      <div
        className={clsx("relative bg-white border-l border-[var(--cp-border-default)] shadow-xl flex flex-col h-full overflow-hidden", side === "right" ? "ml-auto" : "mr-auto")}
        style={{ width }}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--cp-border-subtle)]">
            <h3 className="text-[14px] font-semibold">{title}</h3>
            <button onClick={() => onOpenChange(false)} className="text-[var(--cp-text-tertiary)] hover:text-[var(--cp-text-primary)] cursor-pointer bg-transparent border-none text-lg">&times;</button>
          </div>
        )}
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}

// ═══════════════════════════════════════
// Dropdown
// ═══════════════════════════════════════
interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "start" | "end"
}

export function Dropdown({ trigger, children, align = "start" }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={clsx(
          "absolute z-50 mt-1 min-w-[160px] bg-white border border-[var(--cp-border-default)] rounded-lg shadow-lg py-1",
          align === "end" ? "right-0" : "left-0"
        )}>
          <DropdownContext.Provider value={() => setOpen(false)}>
            {children}
          </DropdownContext.Provider>
        </div>
      )}
    </div>
  )
}

const DropdownContext = createContext<() => void>(() => {})

export function DropdownItem({ onClick, children, className }: { onClick?: () => void; children: React.ReactNode; className?: string }) {
  const close = useContext(DropdownContext)
  return (
    <div
      onClick={() => { onClick?.(); close() }}
      className={clsx("px-3 py-1.5 text-[12px] cursor-pointer hover:bg-[var(--cp-bg-hover)] text-[var(--cp-text-primary)]", className)}
    >
      {children}
    </div>
  )
}

export function DropdownSub({ label, children }: { label: string; children: React.ReactNode }) {
  const [hover, setHover] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="px-3 py-1.5 text-[12px] cursor-pointer hover:bg-[var(--cp-bg-hover)] text-[var(--cp-text-primary)] flex items-center justify-between">
        {label} <span className="text-[10px] text-[var(--cp-text-tertiary)]">&rsaquo;</span>
      </div>
      {hover && (
        <div className="absolute left-full top-0 ml-0.5 min-w-[160px] bg-white border border-[var(--cp-border-default)] rounded-lg shadow-lg py-1 z-50">
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-[var(--cp-border-subtle)]" />
}

// ═══════════════════════════════════════
// Popover
// ═══════════════════════════════════════
interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: "start" | "end"
  width?: string
}

export function Popover({ trigger, children, open: controlledOpen, onOpenChange, align = "start", width }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={clsx("absolute z-50 mt-1 bg-white border border-[var(--cp-border-default)] rounded-lg shadow-lg p-3", align === "end" ? "right-0" : "left-0")} style={width ? { width } : undefined}>
          {children}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════
// Select
// ═══════════════════════════════════════
interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
}

export function Select({ value, onChange, options, placeholder, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "h-8 rounded-md border border-[var(--cp-border-default)] bg-white px-2 text-[12.5px] outline-none cursor-pointer",
        "focus:border-[var(--cp-accent)]",
        className
      )}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ═══════════════════════════════════════
// Switch
// ═══════════════════════════════════════
export function Switch({ checked, onChange, className }: { checked?: boolean; onChange?: (v: boolean) => void; className?: string }) {
  return (
    <button
      onClick={() => onChange?.(!checked)}
      className={clsx(
        "relative w-9 h-5 rounded-full transition-colors cursor-pointer border-none",
        checked ? "bg-[var(--cp-accent)]" : "bg-[var(--cp-border-strong)]",
        className
      )}
    >
      <div className={clsx("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
    </button>
  )
}

// ═══════════════════════════════════════
// Tabs
// ═══════════════════════════════════════
interface TabsProps {
  value: string
  onChange: (value: string) => void
  tabs: { value: string; label: string }[]
  children: React.ReactNode
}

export function Tabs({ value, onChange, tabs, children }: TabsProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex gap-0 border-b border-[var(--cp-border-subtle)] px-4 pt-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={clsx(
              "px-3 py-1.5 text-[12px] font-medium border-b-2 -mb-px cursor-pointer bg-transparent transition-colors",
              value === t.value
                ? "border-[var(--cp-accent)] text-[var(--cp-accent)]"
                : "border-transparent text-[var(--cp-text-tertiary)] hover:text-[var(--cp-text-secondary)]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════
// Collapsible
// ═══════════════════════════════════════
export function Collapsible({ open, onToggle, trigger, children }: {
  open: boolean; onToggle: () => void; trigger: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div>
      <div onClick={onToggle} className="cursor-pointer">{trigger}</div>
      {open && <div>{children}</div>}
    </div>
  )
}

// ═══════════════════════════════════════
// Progress
// ═══════════════════════════════════════
export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={clsx("w-full bg-[var(--cp-border-subtle)] rounded-full overflow-hidden", className ?? "h-1.5")}>
      <div className="h-full bg-[var(--cp-accent)] rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

// ═══════════════════════════════════════
// Checkbox
// ═══════════════════════════════════════
export function Checkbox({ checked, onChange, className }: { checked?: boolean; onChange?: (v: boolean) => void; className?: string }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className={clsx("w-3.5 h-3.5 rounded accent-[var(--cp-accent)] cursor-pointer", className)}
    />
  )
}

// ═══════════════════════════════════════
// ScrollArea (lightweight wrapper)
// ═══════════════════════════════════════
export function ScrollArea({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("overflow-auto", className)}>{children}</div>
}
