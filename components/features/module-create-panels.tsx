import type { ReactNode } from "react"
import { Plus } from "lucide-react"
import type { Area, Goal, Project } from "@/types/database"
import { createGoalAction, createHabitAction, createProcessAction, createProjectAction, createPurposeAction, createRoutineAction, createTaskAction } from "@/app/pos-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const fieldClass = "space-y-2"
const selectClass = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
const summaryClass = "inline-flex h-8 cursor-pointer list-none items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/80 [&::-webkit-details-marker]:hidden"
const days = [
  [1, "Seg"],
  [2, "Ter"],
  [3, "Qua"],
  [4, "Qui"],
  [5, "Sex"],
  [6, "Sáb"],
  [0, "Dom"],
] as const

function CreatePanel({ children, description, title }: { children: ReactNode; description: string; title: string }) {
  return (
    <details className="group rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
      <summary className={summaryClass}>
        <Plus className="size-4" />
        {title}
      </summary>
      <Card className="mt-4 rounded-[20px] border-white/10 bg-black/10">
        <CardContent className="space-y-4 p-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          {children}
        </CardContent>
      </Card>
    </details>
  )
}

function RelationSelects({ areas, goals }: { areas: Area[]; goals?: Goal[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={fieldClass}>
        <Label htmlFor="area_id">Área da vida</Label>
        <select id="area_id" name="area_id" className={selectClass} defaultValue="none">
          <option value="none">Sem área</option>
          {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
        </select>
      </div>
      {goals && (
        <div className={fieldClass}>
          <Label htmlFor="goal_id">Meta vinculada</Label>
          <select id="goal_id" name="goal_id" className={selectClass} defaultValue="none">
            <option value="none">Sem meta</option>
            {goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.title}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}

function PrioritySelect({ max = "critical" }: { max?: "high" | "critical" }) {
  const options = max === "high" ? ["low", "medium", "high"] : ["low", "medium", "high", "critical"]
  const labels: Record<string, string> = { low: "Baixa", medium: "Média", high: "Alta", critical: "Crítica" }
  return (
    <div className={fieldClass}>
      <Label htmlFor="priority">Prioridade</Label>
      <select id="priority" name="priority" className={selectClass} defaultValue="medium">
        {options.map((option) => <option key={option} value={option}>{labels[option]}</option>)}
      </select>
    </div>
  )
}

function WeekdayCheckboxes() {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Dias da semana</legend>
      <div className="flex flex-wrap gap-2">
        {days.map(([value, label]) => (
          <label key={value} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground">
            <input type="checkbox" name="days_of_week" value={value} className="accent-primary" />
            {label}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Se não escolher dias, o sistema considera todos os dias.</p>
    </fieldset>
  )
}

export function CreateTaskPanel({ areas, goals, projects }: { areas: Area[]; goals: Goal[]; projects: Project[] }) {
  return (
    <CreatePanel title="Nova tarefa" description="Crie uma ação diretamente em Tarefas, sem depender do Capturar.">
      <form action={createTaskAction} className="space-y-4">
        <div className={fieldClass}>
          <Label htmlFor="task-title">Título da tarefa</Label>
          <Input id="task-title" name="title" required placeholder="Ex.: Revisar proposta do cliente" />
        </div>
        <div className={fieldClass}>
          <Label htmlFor="task-description">Descrição</Label>
          <Textarea id="task-description" name="description" placeholder="Contexto, próximo passo ou definição de pronto" />
        </div>
        <RelationSelects areas={areas} goals={goals} />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={fieldClass}>
            <Label htmlFor="project_id">Projeto</Label>
            <select id="project_id" name="project_id" className={selectClass} defaultValue="none">
              <option value="none">Sem projeto</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
            </select>
          </div>
          <PrioritySelect />
          <div className={fieldClass}>
            <Label htmlFor="estimated_minutes">Minutos estimados</Label>
            <Input id="estimated_minutes" name="estimated_minutes" type="number" min="0" placeholder="30" />
          </div>
        </div>
        <div className={fieldClass}>
          <Label htmlFor="due_at">Prazo</Label>
          <Input id="due_at" name="due_at" type="datetime-local" />
        </div>
        <Button type="submit">Salvar tarefa</Button>
      </form>
    </CreatePanel>
  )
}

export function CreateGoalPanel({ areas }: { areas: Area[] }) {
  return (
    <CreatePanel title="Nova meta SMART" description="A meta nasce específica, mensurável, alcançável, relevante e temporal.">
      <form action={createGoalAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <Label htmlFor="goal-title">S: específica</Label>
            <Input id="goal-title" name="title" required placeholder="Ex.: Fechar 10 contratos" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="due_date">T: prazo final</Label>
            <Input id="due_date" name="due_date" type="date" required />
          </div>
        </div>
        <div className={fieldClass}>
          <Label htmlFor="goal-description">Descrição específica</Label>
          <Textarea id="goal-description" name="description" placeholder="O que exatamente precisa acontecer?" />
        </div>
        <RelationSelects areas={areas} />
        <div className="grid gap-4 sm:grid-cols-4">
          <div className={fieldClass}>
            <Label htmlFor="metric_name">M: métrica</Label>
            <Input id="metric_name" name="metric_name" required placeholder="Contratos" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="metric_unit">Unidade</Label>
            <Input id="metric_unit" name="metric_unit" placeholder="un." />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="current_value">Atual</Label>
            <Input id="current_value" name="current_value" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="target_value">Alvo</Label>
            <Input id="target_value" name="target_value" type="number" step="0.01" required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <Label htmlFor="progress">Progresso manual (%)</Label>
            <Input id="progress" name="progress" type="number" min="0" max="100" step="0.01" placeholder="Calculado se ficar vazio" />
          </div>
          <PrioritySelect />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <Label htmlFor="motivation">A: por que é alcançável?</Label>
            <Textarea id="motivation" name="motivation" placeholder="Recursos, plano ou motivo que torna a meta possível" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="success_criteria">R: critério de sucesso</Label>
            <Textarea id="success_criteria" name="success_criteria" required placeholder="Como você saberá que alcançou?" />
          </div>
        </div>
        <Button type="submit">Salvar meta</Button>
      </form>
    </CreatePanel>
  )
}

export function CreateProjectPanel({ areas, goals }: { areas: Area[]; goals: Goal[] }) {
  return (
    <CreatePanel title="Novo projeto" description="Crie uma frente com prazo, meta vinculada e progresso inicial.">
      <form action={createProjectAction} className="space-y-4">
        <div className={fieldClass}>
          <Label htmlFor="project-title">Nome do projeto</Label>
          <Input id="project-title" name="title" required placeholder="Ex.: Implantar CRM TELOS" />
        </div>
        <div className={fieldClass}>
          <Label htmlFor="project-description">Descrição</Label>
          <Textarea id="project-description" name="description" placeholder="Resultado esperado e escopo principal" />
        </div>
        <RelationSelects areas={areas} goals={goals} />
        <div className="grid gap-4 sm:grid-cols-3">
          <PrioritySelect />
          <div className={fieldClass}>
            <Label htmlFor="project_due_date">Prazo</Label>
            <Input id="project_due_date" name="due_date" type="date" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="project_progress">Progresso (%)</Label>
            <Input id="project_progress" name="progress" type="number" min="0" max="100" defaultValue="0" />
          </div>
        </div>
        <div className={fieldClass}>
          <Label htmlFor="project-notes">Notas</Label>
          <Textarea id="project-notes" name="notes" placeholder="Próximas decisões, riscos ou marcos" />
        </div>
        <Button type="submit">Salvar projeto</Button>
      </form>
    </CreatePanel>
  )
}

export function CreateHabitPanel({ areas, goals }: { areas: Area[]; goals: Goal[] }) {
  return (
    <CreatePanel title="Novo hábito" description="Crie um hábito rastreável com frequência e alvo de repetição.">
      <form action={createHabitAction} className="space-y-4">
        <div className={fieldClass}>
          <Label htmlFor="habit-title">Nome do hábito</Label>
          <Input id="habit-title" name="title" required placeholder="Ex.: Ler 30 minutos" />
        </div>
        <div className={fieldClass}>
          <Label htmlFor="habit-description">Descrição</Label>
          <Textarea id="habit-description" name="description" placeholder="Como executar o hábito" />
        </div>
        <RelationSelects areas={areas} goals={goals} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <Label htmlFor="frequency">Frequência</Label>
            <select id="frequency" name="frequency" className={selectClass} defaultValue="daily">
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
          <div className={fieldClass}>
            <Label htmlFor="target_count">Alvo por período</Label>
            <Input id="target_count" name="target_count" type="number" min="1" defaultValue="1" />
          </div>
        </div>
        <WeekdayCheckboxes />
        <Button type="submit">Salvar hábito</Button>
      </form>
    </CreatePanel>
  )
}

export function CreateRoutinePanel({ areas, goals }: { areas: Area[]; goals: Goal[] }) {
  return (
    <CreatePanel title="Nova rotina" description="Crie um ritual recorrente com frequência, horário e duração.">
      <form action={createRoutineAction} className="space-y-4">
        <div className={fieldClass}>
          <Label htmlFor="routine-title">Nome da rotina</Label>
          <Input id="routine-title" name="title" required placeholder="Ex.: Revisão semanal" />
        </div>
        <div className={fieldClass}>
          <Label htmlFor="routine-description">Descrição</Label>
          <Textarea id="routine-description" name="description" placeholder="Passos ou intenção da rotina" />
        </div>
        <RelationSelects areas={areas} goals={goals} />
        <div className="grid gap-4 sm:grid-cols-4">
          <PrioritySelect max="high" />
          <div className={fieldClass}>
            <Label htmlFor="routine_frequency">Frequência</Label>
            <select id="routine_frequency" name="frequency" className={selectClass} defaultValue="daily">
              <option value="daily">Diária</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
          <div className={fieldClass}>
            <Label htmlFor="time_of_day">Horário</Label>
            <Input id="time_of_day" name="time_of_day" type="time" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="routine_minutes">Minutos</Label>
            <Input id="routine_minutes" name="estimated_minutes" type="number" min="0" placeholder="45" />
          </div>
        </div>
        <WeekdayCheckboxes />
        <div className={fieldClass}>
          <Label htmlFor="routine-notes">Notas</Label>
          <Textarea id="routine-notes" name="notes" placeholder="Checklist ou observações da rotina" />
        </div>
        <Button type="submit">Salvar rotina</Button>
      </form>
    </CreatePanel>
  )
}

export function CreateProcessPanel({ areas }: { areas: Area[] }) {
  return (
    <CreatePanel title="Novo processo" description="Crie um processo operacional com instruções claras de execução.">
      <form action={createProcessAction} className="space-y-4">
        <div className={fieldClass}>
          <Label htmlFor="process-title">Nome do processo</Label>
          <Input id="process-title" name="title" required placeholder="Ex.: Onboarding de cliente" />
        </div>
        <RelationSelects areas={areas} />
        <div className={fieldClass}>
          <Label htmlFor="process-description">Descrição</Label>
          <Textarea id="process-description" name="description" placeholder="Objetivo e quando usar este processo" />
        </div>
        <div className={fieldClass}>
          <Label htmlFor="instructions">Instruções</Label>
          <Textarea id="instructions" name="instructions" className="min-h-28" placeholder="1. Diagnosticar\n2. Executar\n3. Validar" />
        </div>
        <Button type="submit">Salvar processo</Button>
      </form>
    </CreatePanel>
  )
}

export function CreatePurposePanel() {
  return (
    <CreatePanel title="Novo propósito" description="O schema atual guarda um propósito ativo por usuário; salvar aqui cria ou atualiza sua direção central.">
      <form action={createPurposeAction} className="space-y-4">
        <div className={fieldClass}>
          <Label htmlFor="purpose">Propósito</Label>
          <Textarea id="purpose" name="purpose" required placeholder="Por que esse sistema e sua vida organizada existem?" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <Label htmlFor="mission">Missão</Label>
            <Textarea id="mission" name="mission" placeholder="O que você executa no presente" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="vision">Visão</Label>
            <Textarea id="vision" name="vision" placeholder="Onde você quer chegar" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <Label htmlFor="identity_statement">Declaração de identidade</Label>
            <Textarea id="identity_statement" name="identity_statement" placeholder="Quem você está se tornando" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="long_term_vision">Visão de longo prazo</Label>
            <Textarea id="long_term_vision" name="long_term_vision" placeholder="Horizonte de 3, 5 ou 10 anos" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={fieldClass}>
            <Label htmlFor="values">Valores</Label>
            <Textarea id="values" name="values" placeholder="Um por linha" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="principles">Princípios</Label>
            <Textarea id="principles" name="principles" placeholder="Um por linha" />
          </div>
          <div className={fieldClass}>
            <Label htmlFor="priorities">Prioridades</Label>
            <Textarea id="priorities" name="priorities" placeholder="Uma por linha" />
          </div>
        </div>
        <Button type="submit">Salvar propósito</Button>
      </form>
    </CreatePanel>
  )
}
