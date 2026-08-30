"use server"
import { logout as performLogout } from "@/app/login/actions"

export async function logout() {
  await performLogout()
}
