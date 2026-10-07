// Followung the rule one class per file
import { Task } from "./task";
import { Repository } from "./repository";
import { NotFoundError,InvalidStateError } from "./errors";
export class TaskStore{
    private readonly owner:string;
    private repo=new Repository<Task>();


    constructor(owner:string){
        this.owner=owner;
    }
    public add(task:Task):void{
        if(task.id <=0)
            throw new InvalidStateError("id cannot be negative");
        if(task.title.trim()==="")
            throw new InvalidStateError("Title cannot be empty");
        this.repo.add(task.id,task);
    }
    public findById(id:number):Task|undefined{
        
        const task= this.repo.findById(id);
        if (task===undefined){
            throw new NotFoundError("task",id);
        }
        return task;
    }
    public getSize():number{
        return this.repo.getSize()
    }
    // For this small usecase it may look like over engineering but in real world instantiating taskstore will not be that simple. So  there this static method makes sense
    public static empty():TaskStore{
        return new TaskStore("Annonymous");
    }

}


