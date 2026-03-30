// Auth & general utilities - ported from SupFront/src/app/utils/util_func.ts

import { CallDirFileGet, CallDirFilePost } from "@/lib/api"
import { ResultResp } from "@/lib/types"
import React, { useEffect, useRef } from "react"

export function saveLoginToken(token: string) {
  localStorage.setItem("login_token", token)
}

export function getLoginToken() {
  return localStorage.getItem("login_token") || ""
}

export function clearLoginToken() {
  localStorage.removeItem("login_token")
}

export function hashPassword(password: string) {
  // Use Web Crypto API instead of Node crypto for browser compatibility
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  return crypto.subtle.digest("SHA-256", data).then((hash) => {
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  })
}

export function startFile(path: string, w_dir?: string) {
  const params = new Map<string, string>()
  params.set("action", "start_file")
  params.set("path", path)
  params.set("out_dir", w_dir ?? "")
  const post_params = new FormData()
  CallDirFilePost(params, post_params).then((res) => {
    console.log(res)
  })
}

export function explorerOpenFile(path: string) {
  const params = new Map<string, string>()
  params.set("path", encodeURIComponent(path))
  params.set("action", "open_file")
  CallDirFileGet(params).then((value) => {
    console.log(value)
  })
}

export function openDirDialog(setDir: (dir: string) => void, saveDir: (dir: string) => void) {
  const params = new Map<string, string>()
  params.set("action", "open_directory_dialog")
  CallDirFileGet(params).then((value) => {
    const resp: ResultResp = JSON.parse(value)
    if (resp.result) {
      setDir(resp.result)
      saveDir(resp.result)
    }
  })
}

export function DebouncedRefresh(
  v: any,
  timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  cb: Function,
  delay = 1000
) {
  if (timerRef.current) {
    clearTimeout(timerRef.current)
  }
  timerRef.current = setTimeout(() => {
    cb(v)
  }, delay)
}

export const useInterval = (cb: Function, time = 1000) => {
  const cbRef = useRef<Function>()
  useEffect(() => {
    cbRef.current = cb
  })
  useEffect(() => {
    const callback = () => {
      cbRef.current?.()
    }
    const timer = setInterval(() => {
      callback()
    }, time)
    return () => clearInterval(timer)
  }, [])
}
