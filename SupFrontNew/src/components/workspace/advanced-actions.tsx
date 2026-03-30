"use client"

import { useState } from "react"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Collapsible } from "@/components/ui"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallPluginExec, PluginExecParams } from "@/lib/api"
import { startFile, explorerOpenFile } from "@/lib/auth-utils"

export function AdvancedActions() {
  const [open, setOpen] = useState(false)

  const trigger = (
    <button className="flex items-center gap-2 text-[12px] font-semibold tracking-wider uppercase text-[var(--cp-text-tertiary)] mb-3 hover:text-[var(--cp-text-secondary)] transition-colors cursor-pointer bg-transparent border-none p-0">
      <svg className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
      高级操作
    </button>
  )

  return (
    <Collapsible open={open} onToggle={() => setOpen(!open)} trigger={trigger}>
      <div className="grid grid-cols-2 gap-3">
        <ProjectCard />
        <JNPMCard />
        <AudioCard />
        <SceneCard />
      </div>
    </Collapsible>
  )
}

function ActionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[var(--cp-border-subtle)] rounded-lg p-4 bg-white">
      <h3 className="text-[12px] font-semibold text-[var(--cp-text-primary)] mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ProjectCard() {
  const { projDir } = useCoPiperStore()
  return (
    <ActionCard title="工程操作">
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={() => projDir && startFile(`${projDir}\\client\\打开Unity.bat`)}>
        打开 Unity
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={() => projDir && explorerOpenFile(projDir)}>
        打开项目目录
      </Button>
    </ActionCard>
  )
}

function JNPMCard() {
  const { projDir } = useCoPiperStore()
  const [versionId, setVersionId] = useState("")

  async function handleSync() {
    if (!versionId) return
    const p = new PluginExecParams("jnpm", "sync", `version_id=${versionId}|proj_dir=${projDir}`)
    await CallPluginExec(p)
  }

  return (
    <ActionCard title="JNPM 操作">
      <div className="flex gap-1">
        <Input value={versionId} onChange={(e) => setVersionId(e.target.value)} placeholder="版本 ID" className="h-7 text-[11px] flex-1" />
        <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={handleSync}>同步</Button>
      </div>
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={async () => {
        const p = new PluginExecParams("jnpm", "open_url_in_browser")
        await CallPluginExec(p)
      }}>
        打开外部表格
      </Button>
    </ActionCard>
  )
}

function AudioCard() {
  const { projDir } = useCoPiperStore()
  return (
    <ActionCard title="音频操作">
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={async () => {
        const p = new PluginExecParams("copiper_import_res", "copy_manifest_asset_to_new_path")
        await CallPluginExec(p)
      }}>
        复制 Manifest
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={async () => {
        const p = new PluginExecParams("copiper_svn", "upload_audio_files", `file_type=res`)
        await CallPluginExec(p)
      }}>
        上传音频资源
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={async () => {
        const p = new PluginExecParams("copiper_svn", "upload_audio_files", `file_type=index`)
        await CallPluginExec(p)
      }}>
        上传音频映射
      </Button>
    </ActionCard>
  )
}

function SceneCard() {
  const { projDir } = useCoPiperStore()
  const [mapName, setMapName] = useState("")
  return (
    <ActionCard title="场景操作">
      <Input value={mapName} onChange={(e) => setMapName(e.target.value)} placeholder="地图名称" className="h-7 text-[11px]" />
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={async () => {
        if (!mapName) return
        const p = new PluginExecParams("copiper_svn", "upload_npc_files", `map_name=${mapName}`)
        await CallPluginExec(p)
      }}>
        上传实体/NPC
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start h-7 text-[11px]" onClick={async () => {
        if (!mapName) return
        const p = new PluginExecParams("copiper_svn", "upload_zone_files", `map_name=${mapName}`)
        await CallPluginExec(p)
      }}>
        上传 Zone 文件
      </Button>
    </ActionCard>
  )
}
