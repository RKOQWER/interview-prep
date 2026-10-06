export type Status="todo" | "in_progress" | "done";

export interface Task {
    id: number;
    title: string;
    status: Status;
    assignee?: {name:string};
}

export function moveTask(t:Task,status:Status){
    const t2={...t,status:status};
    return t2;
}

export function assigneeName(t:Task):string{
    return t.assignee?.name ?? "unassigned";
}