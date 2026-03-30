"use client"

import { useEffect } from "react"
import { TabContent } from "@/components/layout/tab-content"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallCoPiperPost, CallClientAction } from "@/lib/api"
import { ResultResp, AntdOption } from "@/lib/types"

export default function MainPage() {
  const { updateProjDir, updateTbOptions } = useCoPiperStore()

  useEffect(() => {
    // Load project info on mount (same as SupFront page.tsx getProjInfo)
    async function init() {
      try {
        // 1. Get project info
        const params = new Map<string, string>([["action", "get_proj_info"]])
        const res = await CallCoPiperPost(params, new FormData())
        const resp: { proj_dir: string; options: AntdOption[]; status_code: string } = JSON.parse(res)
        if (resp.proj_dir) updateProjDir(resp.proj_dir)
        if (resp.options) updateTbOptions(resp.options)
      } catch {
        // Backend not available, try loading saved setting
        try {
          const sp = new Map<string, string>([["action", "get_setting"], ["name", "copiper_project_dir"]])
          const sres = await CallClientAction(sp, new FormData())
          const sresp: ResultResp = JSON.parse(sres)
          if (sresp.result) updateProjDir(sresp.result)
        } catch {}
      }
    }
    init()
  }, [])

  return <TabContent />
}
