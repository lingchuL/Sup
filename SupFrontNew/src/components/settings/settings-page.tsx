"use client"

import { Input } from "@/components/ui"
import { Switch } from "@/components/ui"

export function SettingsPage() {
  return (
    <div className="p-8 px-10 overflow-y-auto flex-1">
      <h1 className="text-[20px] font-bold text-[var(--cp-text-primary)] mb-6 tracking-tight">设置</h1>

      <SettingsGroup title="连接">
        <SettingRow label="后端地址" desc="FastAPI 服务端口">
          <Input defaultValue="http://127.0.0.1:8133" className="w-[280px] h-[30px] font-mono text-[12px]" />
        </SettingRow>
        <SettingRow label="默认项目路径" desc="启动时自动加载的工作目录">
          <Input defaultValue="" placeholder="D:/Projects/..." className="w-[280px] h-[30px] font-mono text-[12px]" />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="外观">
        <SettingRow label="深色模式" desc="切换明暗主题">
          <Switch checked={false} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="紧凑行高" desc="表格使用更小的行高以显示更多数据">
          <Switch checked={false} onChange={() => {}} />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="数据">
        <SettingRow label="自动保存" desc="编辑后自动保存变更">
          <Switch checked={false} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="冻结列数" desc="左侧固定列数量">
          <Input defaultValue="4" className="w-[80px] h-[30px] font-mono text-[12px] text-center" />
        </SettingRow>
      </SettingsGroup>
    </div>
  )
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[var(--cp-text-tertiary)] mb-2.5">{title}</h2>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function SettingRow({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-3 px-4 bg-white border border-[var(--cp-border-subtle)] rounded-lg">
      <div className="flex-1">
        <div className="text-[13px] font-medium text-[var(--cp-text-primary)]">{label}</div>
        <div className="text-[11px] text-[var(--cp-text-tertiary)] mt-px">{desc}</div>
      </div>
      {children}
    </div>
  )
}
