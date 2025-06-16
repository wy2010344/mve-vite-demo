import { createContext } from "mve-core"
import { StoreRef } from "wy-helper"

export interface Column {
  id: string
  title: string
  tasks: Task[]
}
/**
 
title: "待审核",
 */
export type TaskType = 'todo' | 'inprogress' | 'review' | 'done'
export type PriorityType = "low" | "medium" | "high"
export const priorityTypes: PriorityType[] = ['low', 'medium', 'high']
export interface Task {
  type: TaskType
  id: string
  title: string
  description?: string
  priority: PriorityType
  assignee?: string
  dueDate?: string
}

export const TaskContext = createContext<{
  tasks: StoreRef<Task[]>
  dragId: StoreRef<string | undefined>
}>(undefined!)

export const ColumnContext = createContext<{
  type: TaskType,
  getActive(): string | undefined
}>(undefined!)