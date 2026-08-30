import { Skeleton } from "@/components/ui/skeleton"
export default function Loading() { return <div className="mx-auto grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-40 rounded-[24px]" />)}</div> }
