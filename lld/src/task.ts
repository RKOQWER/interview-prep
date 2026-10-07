export type Status="todo" | "in_progress" | "done";

export interface Task {
    readonly id: number;
    readonly title: string;
    status: Status;
    assignee?: {name:string};
    dueDate?:string;
}

export function moveTask(t:Task,status:Status){
    const t2={...t,status:status};
    return t2;
}

export function assigneeName(t:Task):string{
    return t.assignee?.name ?? "unassigned";
}

const t1:{id:number,title:string,status:Status,extra:number}={id:1,title:"Rahul",status:"todo",extra:1};

const t2:Task=t1;