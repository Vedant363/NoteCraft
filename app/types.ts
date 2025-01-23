export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  due_date?: string
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

