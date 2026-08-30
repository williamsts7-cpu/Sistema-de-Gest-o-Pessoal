"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getCurrentProfile } from "@/services/profile.service"
export function useCurrentProfileName() {
  const [name, setName] = useState("Minha conta")
  useEffect(() => { let active = true; getCurrentProfile(createClient()).then(profile => { if (active && profile?.full_name) setName(profile.full_name) }).catch(() => undefined); return () => { active = false } }, [])
  return name
}
