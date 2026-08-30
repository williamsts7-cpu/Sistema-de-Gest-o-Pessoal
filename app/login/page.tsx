import { LoginForm } from "@/app/login/login-form"
import Image from "next/image"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/dashboard" } = await searchParams
  return <div className="flex min-h-screen items-center justify-center p-4"><div className="flex w-full flex-col items-center gap-6"><div className="flex flex-col items-center text-center"><div className="flex h-32 w-80 items-center justify-center overflow-hidden"><Image src="/logo_telonexus_transp.png" alt="Telos Nexus" width={1536} height={1024} className="w-[430px] max-w-none object-contain" priority /></div><h1 className="-mt-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-xl font-medium tracking-tight text-transparent">Personal Operating System</h1></div><LoginForm next={next} /></div></div>
}
