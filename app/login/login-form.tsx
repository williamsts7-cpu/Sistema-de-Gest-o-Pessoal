"use client"

import { useActionState, useState } from "react"
import { authenticate, type AuthState } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/components/i18n-provider"

const initialState: AuthState = { error: null, message: null }

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [state, action, pending] = useActionState(authenticate, initialState)
  const { locale, t } = useI18n()

  return (
    <Card className="glass-panel w-full max-w-md rounded-[24px]">
      <CardHeader><CardTitle className="text-2xl font-medium tracking-tight">{mode === "login" ? t("login.signIn") : t("login.signUp")}</CardTitle></CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="mode" value={mode} />
          {mode === "signup" && <div className="space-y-2"><Label htmlFor="fullName">{t("login.name")}</Label><Input id="fullName" name="fullName" autoComplete="name" /></div>}
          <div className="space-y-2"><Label htmlFor="email">{t("login.email")}</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
          <div className="space-y-2"><Label htmlFor="password">{t("login.password")}</Label><Input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required /></div>
          {state.error && <p role="alert" className="text-sm text-red-300">{locale === "en" ? "We could not complete authentication. Check your details." : state.error}</p>}
          {state.message && <p role="status" className="text-sm text-emerald-300">{locale === "en" ? "Account created. Confirm your email before signing in." : state.message}</p>}
          <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:from-fuchsia-500 hover:to-indigo-500" disabled={pending}>{pending ? t("login.wait") : mode === "login" ? t("login.signIn") : t("login.signUp")}</Button>
          <Button type="button" variant="ghost" className="w-full rounded-full" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? t("login.createFirst") : t("login.haveAccount")}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
