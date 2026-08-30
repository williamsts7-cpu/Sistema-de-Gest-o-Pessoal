"use client"
import { Button } from "@/components/ui/button"
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <div className="mx-auto max-w-3xl rounded-[24px] border border-red-400/20 bg-red-400/5 p-8 text-center"><h2 className="text-xl font-semibold">Nao foi possivel carregar as areas</h2><p className="mt-2 text-sm text-muted-foreground">Verifique sua conexao e tente novamente.</p><Button className="mt-4" onClick={reset}>Tentar novamente</Button></div> }
