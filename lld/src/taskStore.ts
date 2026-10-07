// Followung the rule one class per file
import { Task } from "./task";
export class TaskStore{
    private readonly owner:string;
    private tasks:Task[]=[];

    constructor(owner:string){
        this.owner=owner;
    }
    public add(task:Task):void{
        this.tasks=[...this.tasks,task];
    }
    public findById(id:number):Task|undefined{
        for(let i=0;i<this.tasks.length;i++){
            if (this.tasks[i]?.id==id)
                return this.tasks[i];
        }
    }
    public getSize():number{
        return this.tasks.length;
    }
    // For this small usecase it may look like over engineering but in real world instantiating taskstore will not be that simple. So  there this static method makes sense
    public static empty():TaskStore{
        return new TaskStore("Annonymous");
    }

}


