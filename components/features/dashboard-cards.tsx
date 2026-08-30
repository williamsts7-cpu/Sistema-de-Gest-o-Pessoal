import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface TaskCardData { id: string; completed: boolean; title: string; area: string; project: string; time: string }
interface HabitCardData { id: string; completed: boolean; title: string; streak: number }
interface ProjectCardData { name: string; status: string; area: string; progress: number; deadline: string }
interface GoalCardData { title: string; area: string; progress: number; target: string }

export function TaskItem({ task }: { task: TaskCardData }) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 backdrop-blur-md">
      <Checkbox id={task.id} defaultChecked={task.completed} className="mt-1 border-white/20 data-[state=checked]:bg-fuchsia-500 data-[state=checked]:border-fuchsia-500" />
      <div className="flex flex-1 flex-col gap-1.5">
        <label
          htmlFor={task.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {task.title}
        </label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Badge variant="outline" className="font-normal text-[10px] px-2 py-0.5 border-white/10 bg-white/5 text-cyan-300">
            {task.area}
          </Badge>
          <span>•</span>
          <span>{task.project}</span>
          <span>•</span>
          <span>{task.time}</span>
        </div>
      </div>
    </div>
  )
}

export function HabitCard({ habit }: { habit: HabitCardData }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 p-3 px-4 hover:bg-white/10 transition-colors backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Checkbox id={habit.id} defaultChecked={habit.completed} className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" />
        <label htmlFor={habit.id} className="text-sm font-medium leading-none">
          {habit.title}
        </label>
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="font-semibold text-primary">{habit.streak}</span> dias
      </div>
    </div>
  )
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Card className="rounded-[24px] border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{project.name}</CardTitle>
          <Badge variant="secondary" className="text-[10px] bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 border-transparent">{project.status}</Badge>
        </div>
        <CardDescription className="text-xs">{project.area}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progresso</span>
          <span className="text-indigo-300 font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-cyan-400" />
        <div className="mt-2 text-[10px] text-muted-foreground text-right">
          Prazo: {project.deadline}
        </div>
      </CardContent>
    </Card>
  )
}

export function GoalCard({ goal }: { goal: GoalCardData }) {
  return (
    <Card className="rounded-[24px] border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-medium">{goal.title}</CardTitle>
        <CardDescription className="text-xs text-cyan-300/80">{goal.area}</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progresso</span>
          <span className="text-fuchsia-300 font-medium">{goal.progress}%</span>
        </div>
        <Progress value={goal.progress} className="h-1.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-fuchsia-500 [&>div]:to-indigo-500" />
        <div className="mt-2 text-[10px] text-muted-foreground text-right">
          Alvo: {goal.target}
        </div>
      </CardContent>
    </Card>
  )
}
