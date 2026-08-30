import { createClient } from "@/lib/supabase/server"
import { listAreas } from "@/services/area.service"
import { AreasClient } from "@/app/areas/areas-client"

export default async function AreasPage() {
  const areas = await listAreas(await createClient())
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-6"><AreasClient areas={areas} /></div>
}
