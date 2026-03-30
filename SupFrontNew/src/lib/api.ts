// API layer - ported from SupFront/src/app/api/route_api.ts

import { getLoginToken } from "@/lib/auth-utils"

export function FormUrl(url_route: string, params: Map<string, string>): string {
  let url_param = ""
  params.forEach(function (value, key) {
    url_param += "&" + key + "=" + value
  })
  let url = ""
  if (url_route == "supback") {
    url = encodeURI("http://127.0.0.1:8132/" + url_route + "?" + url_param.substring(1))
  } else {
    url = encodeURI("http://127.0.0.1:8133/" + url_route + "?" + url_param.substring(1))
  }
  return url
}

export function formFileUrl(url_route: string, rel_url: string): string {
  return encodeURI(`http://127.0.0.1:8133/${url_route}?action=get_file&rel_url=${rel_url}`)
}

export async function CallGetAction(url_route: string, params: Map<string, string>): Promise<string> {
  const url = FormUrl(url_route, params)
  const res = await fetch(url, {
    headers: { "Content-Type": "text/json" },
    method: "GET",
    cache: "no-cache",
  })
  return await res.text()
}

export async function CallPostAction(
  url_route: string,
  arg_params: Map<string, string>,
  form_params: FormData
): Promise<string> {
  const url = FormUrl(url_route, arg_params)
  form_params.set("login_token", getLoginToken())
  const res = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    body: form_params,
  })
  return await res.text()
}

export async function CallSSEAction(
  url_route: string,
  arg_params: Map<string, string>,
  onMessage: (data: string) => void,
  onError?: (error: any) => void
): Promise<void> {
  const url = FormUrl(url_route, arg_params)
  const eventSource = new EventSource(url)

  eventSource.onmessage = (event) => {
    onMessage(event.data)
  }

  return new Promise((resolve) => {
    eventSource.onerror = (error) => {
      if (onError) onError(error)
      eventSource.close()
      resolve()
    }
  })
}

// Route enums
export enum UrlRoutes {
  DirFile = "dir_file",
  Vision = "vision",
  Audio = "audio",
  Copilot = "copilot",
  Database = "database",
  Copiper = "copiper",
  Version = "version",
  Supback = "supback",
  Plugin = "plugin",
  Client = "client",
  Login = "login",
  Progress = "progress",
}

// Convenience wrappers
export async function CallDirFileGet(params: Map<string, string>) {
  return await CallGetAction("dir_file", params)
}
export async function CallDirFilePost(params: Map<string, string>, form: FormData) {
  return await CallPostAction("dir_file", params, form)
}
export async function CallCoPiperPost(params: Map<string, string>, form: FormData) {
  return await CallPostAction("copiper", params, form)
}
export async function CallDatabasePost(params: Map<string, string>, form: FormData) {
  return await CallPostAction("database", params, form)
}
export async function CallPluginAction(params: Map<string, string>, form: FormData) {
  return await CallPostAction("plugin", params, form)
}
export async function CallPluginSSE(
  params: Map<string, string>,
  onMessage: (data: string) => void,
  onError?: (error: any) => void
) {
  return await CallSSEAction("plugin_sse", params, onMessage, onError)
}
export async function CallClientAction(params: Map<string, string>, form: FormData) {
  return await CallPostAction("client", params, form)
}
export async function CallVersionAction(params: Map<string, string>, form: FormData) {
  return await CallPostAction("version", params, form)
}
export async function CallAudioPost(params: Map<string, string>, form: FormData) {
  return await CallPostAction("audio", params, form)
}
export async function CallSupAction(params: Map<string, string>, form: FormData) {
  return await CallPostAction("supback", params, form)
}

// Plugin exec helper
export class PluginExecParams {
  args_params: Map<string, any> = new Map<string, any>()
  post_params: FormData = new FormData()
  constructor(pluginName: string, funcName: string, argsStr?: string, postDataJsonStr?: string) {
    this.args_params.set("action", "plugin_exec")
    this.args_params.set("name", pluginName)
    this.args_params.set("func", funcName)
    if (argsStr) this.args_params.set("args", argsStr.replaceAll("#", "--_--"))
    if (postDataJsonStr) this.post_params.set("post_data", postDataJsonStr)
  }
}

export async function CallPluginExec(params: PluginExecParams): Promise<string> {
  return await CallPostAction("plugin", params.args_params, params.post_params)
}
