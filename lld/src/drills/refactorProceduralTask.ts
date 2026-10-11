
export type TaskStatus="todo" | "in_progress" | "done";

interface Task {
    id:number;
    title:string;
    status: TaskStatus;
    owner:string;
}

export class TaskManger{

    private tasks:Task[];
    public static nextId=0;

    constructor(){
        this.tasks=[];
    }

    public static getNextId():number{
        TaskManger.nextId++;
        return TaskManger.nextId;
    }

    public addTask(title:string,owner:string):number{
        if(title.trim()==="") 
            throw new Error("Title cannot be empty");
        const id=TaskManger.getNextId();
        this.tasks.push({id,title,owner,status: "todo"});
        return id;
    }

    public startTask(id:number):boolean{
        // Mark task from to_do to in_progress
        for(let i=0;i<this.tasks.length;i++){
            const t=this.tasks[i] as Task;
            if (t.id===id && t.status==="todo"){
                t.status="in_progress";
                return true;
            }
            if(t.id===id && t.status!=="todo"){
                console.log("Task is not in todo status.")
                return false;
            }
        }
        return false;
    }

    public completeTask(id:number):boolean{
        // Mark the task as completed
        for(let i=0;i<this.tasks.length;i++){
            if(this.tasks[i]?.id===id){
                const t=this.tasks[i] as Task;
                if(t.status==="in_progress"){
                    t.status="done"; 
                    return true;
                }
                else{
                    console.log("To move the task to done it should be in in_progress");
                    return false;
                }
                
            }
        }
        return false;
    }

    public reassign(id:number,newOwner:string): boolean{
        for(let i=0;i<this.tasks.length;i++){
            if(this.tasks[i]?.id===id ){
                const t=this.tasks[i] as Task;
                t.owner=newOwner;
                return true;
            }
        }
        return false;
    }

    public allDone():boolean{
        for(let i=0;i<this.tasks.length;i++){
            if(this.tasks?.[i]?.status!="done")
                return false;
        }
        return true;
    }
}