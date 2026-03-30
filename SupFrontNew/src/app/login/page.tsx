"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button, Input } from "@/components/ui"
import { useAppStore } from "@/stores/app-store"
import { CallPostAction, UrlRoutes } from "@/lib/api"
import { saveLoginToken, hashPassword } from "@/lib/auth-utils"
import { ResultResp } from "@/lib/types"

type LoginState = "sign_in" | "auto_login" | "sign_up"

export default function LoginPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const { userName, userAvatar, updateUserName, updateUserAvatar } = useAppStore()
  const [loginState, setLoginState] = useState<LoginState>("sign_in")
  const [random] = useState(() => Math.random())

  useEffect(() => {
    tryAutoLogin()
    videoRef.current?.play().catch(() => {})
  }, [])

  async function tryAutoLogin() {
    try {
      const params = new Map<string, string>([["action", "try_auto_sign_in"]])
      const res = await CallPostAction(UrlRoutes.Client, params, new FormData())
      const resp: { name: string; avatar_big: string; status_code: number } = JSON.parse(res)
      if (resp.name) {
        updateUserName(resp.name ?? "")
        updateUserAvatar(resp.avatar_big ?? "")
        setLoginState("auto_login")
      }
    } catch {}
  }

  function openFeishuLogin() {
    const loginUrl = encodeURI(
      "https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=cli_a84a9041c33dd00c&redirect_uri=http://localhost:3000/login_redirect&state=yes"
    )
    window.open(loginUrl, "飞书登录", "width=600,height=600,left=300,top=300,menubar=no,toolbar=no,status=no")
    window.addEventListener("message", (event) => {
      if (event.origin === window.location.origin && event.data?.userInfo) {
        updateUserName(event.data.userInfo.name)
        updateUserAvatar(event.data.userInfo.avatar_big)
        router.push("/main")
      }
    })
  }

  async function handleSignIn(acc: string, pwd: string) {
    try {
      const hashedPwd = await hashPassword(pwd)
      const params = new Map<string, string>([["action", "sign_in"]])
      const form = new FormData()
      form.set("uname", acc)
      form.set("pwd", hashedPwd)
      const res = await CallPostAction(UrlRoutes.Client, params, form)
      const resp: ResultResp = JSON.parse(res)
      if (resp.status_code == "200") {
        saveLoginToken(resp.result)
        updateUserName(acc)
        router.push("/main")
      }
    } catch {
      // Backend unreachable — dev mode
      saveLoginToken("dev_token")
      updateUserName(acc || "dev")
      router.push("/main")
    }
  }

  async function handleSignUp(acc: string, pwd: string) {
    try {
      const hashedPwd = await hashPassword(pwd)
      const params = new Map<string, string>([["action", "sign_up"]])
      const form = new FormData()
      form.set("uname", acc)
      form.set("pwd", hashedPwd)
      const res = await CallPostAction(UrlRoutes.Client, params, form)
      const resp: ResultResp = JSON.parse(res)
      if (resp.status_code == "200") {
        updateUserName(acc)
        setLoginState("sign_in")
      }
    } catch {}
  }

  return (
    <div className="h-screen w-screen bg-white electron-dragable relative overflow-hidden">
      <video ref={videoRef} autoPlay loop muted playsInline className="h-screen w-screen object-cover">
        {random > 0.7 && <source src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr" type="video/mp4" />}
        {random <= 0.7 && <source src="https://copiper-res.tos-cn-guangzhou.volces.com/bg_video_new.mp4" type="video/mp4" />}
      </video>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute z-10 top-[20vh] right-[10vw] electron-undragable">
        <div className="w-[25vw] min-w-[320px] bg-white rounded-lg shadow-2xl p-8 text-center" style={{ minHeight: "55vh" }}>
          {loginState === "sign_in" && <SignInForm initialAccount={userName} onSignIn={handleSignIn} onFeishuLogin={openFeishuLogin} onGoSignUp={() => setLoginState("sign_up")} />}
          {loginState === "auto_login" && <AutoLoginView userName={userName} userAvatar={userAvatar} onSignIn={() => router.push("/main")} onReturn={() => setLoginState("sign_in")} />}
          {loginState === "sign_up" && <SignUpForm onSignUp={handleSignUp} onReturn={() => setLoginState("sign_in")} />}
        </div>
      </div>
    </div>
  )
}

function SignInForm({ initialAccount, onSignIn, onFeishuLogin, onGoSignUp }: {
  initialAccount: string; onSignIn: (acc: string, pwd: string) => void; onFeishuLogin: () => void; onGoSignUp: () => void
}) {
  const [acc, setAcc] = useState(initialAccount || "")
  const [pwd, setPwd] = useState("")
  return (
    <>
      <h1 className="text-[24px] font-bold text-[var(--cp-text-primary)] mb-2">CoPiper</h1>
      <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-[var(--cp-border-default)]" /><span className="text-[12px] text-[var(--cp-text-tertiary)] italic">账密登录</span><div className="flex-1 h-px bg-[var(--cp-border-default)]" /></div>
      <form onSubmit={(e) => { e.preventDefault(); onSignIn(acc, pwd) }} className="text-left space-y-4">
        <div><label className="block text-[12px] font-medium text-[var(--cp-text-secondary)] mb-1.5">账号</label><Input value={acc} onChange={(e) => setAcc(e.target.value)} placeholder="请输入账号" className="h-9" /></div>
        <div><label className="block text-[12px] font-medium text-[var(--cp-text-secondary)] mb-1.5">密码</label><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="请输入密码" className="h-9" /></div>
        <Button type="submit" className="w-full h-9 text-[13px]">登录</Button>
      </form>
      <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-[var(--cp-border-default)]" /></div>
      <Button variant="outline" className="w-full h-9 text-[13px]" onClick={onGoSignUp}>注册</Button>
    </>
  )
}

function AutoLoginView({ userName, userAvatar, onSignIn, onReturn }: {
  userName: string; userAvatar: string; onSignIn: () => void; onReturn: () => void
}) {
  return (
    <>
      <h1 className="text-[24px] font-bold text-[var(--cp-text-primary)] mb-2">CoPiper</h1>
      <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-[var(--cp-border-default)]" /><span className="text-[12px] text-[var(--cp-text-tertiary)] italic">自动登录</span><div className="flex-1 h-px bg-[var(--cp-border-default)]" /></div>
      <div className="flex flex-col items-center gap-3 my-8">
        {userAvatar ? <img src={userAvatar} alt="" className="w-24 h-24 rounded-full object-cover" /> :
          <div className="w-24 h-24 rounded-full bg-[#00a2ae] flex items-center justify-center text-white text-[48px] font-light cursor-default">{userName?.[0]?.toUpperCase() || "A"}</div>}
        <span className="text-[14px] text-[var(--cp-text-secondary)]">欢迎回来，{userName}！</span>
      </div>
      <div className="space-y-2.5"><Button className="w-full h-9 text-[13px]" onClick={onSignIn}>登录</Button><Button variant="outline" className="w-full h-9 text-[13px]" onClick={onReturn}>返回</Button></div>
    </>
  )
}

function SignUpForm({ onSignUp, onReturn }: { onSignUp: (acc: string, pwd: string) => void; onReturn: () => void }) {
  const [acc, setAcc] = useState("")
  const [pwd, setPwd] = useState("")
  const [pwd2, setPwd2] = useState("")
  const [error, setError] = useState("")
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pwd !== pwd2) { setError("两次密码不一致"); return }
    if (!acc || !pwd) { setError("请填写所有字段"); return }
    setError(""); onSignUp(acc, pwd)
  }
  return (
    <>
      <h1 className="text-[24px] font-bold text-[var(--cp-text-primary)] mb-2">CoPiper</h1>
      <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-[var(--cp-border-default)]" /><span className="text-[12px] text-[var(--cp-text-tertiary)] italic">注册账号</span><div className="flex-1 h-px bg-[var(--cp-border-default)]" /></div>
      <form onSubmit={handleSubmit} className="text-left space-y-4">
        <div><label className="block text-[12px] font-medium text-[var(--cp-text-secondary)] mb-1.5">账号</label><Input value={acc} onChange={(e) => setAcc(e.target.value)} placeholder="请输入账号" className="h-9" /></div>
        <div><label className="block text-[12px] font-medium text-[var(--cp-text-secondary)] mb-1.5">密码</label><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="请输入密码" className="h-9" /></div>
        <div><label className="block text-[12px] font-medium text-[var(--cp-text-secondary)] mb-1.5">确认密码</label><Input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} placeholder="再次输入密码" className="h-9" /></div>
        {error && <p className="text-[12px] text-[var(--cp-error)]">{error}</p>}
        <Button type="submit" className="w-full h-9 text-[13px]">注册</Button>
      </form>
      <div className="mt-4"><Button variant="outline" className="w-full h-9 text-[13px]" onClick={onReturn}>返回登录</Button></div>
    </>
  )
}
