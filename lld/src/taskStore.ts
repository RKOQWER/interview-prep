// Followung the rule one class per file
import { Task } from "./task";
import { Repository } from "./repository";
export class TaskStore{
    private readonly owner:string;
    private repo=new Repository<Task>();


    constructor(owner:string){
        this.owner=owner;
    }
    public add(task:Task):void{
        this.repo.add(task.id,task);
    }
    public findById(id:number):Task|undefined{
        return this.repo.findById(id);
    }
    public getSize():number{
        return this.repo.getSize()
    }
    // For this small usecase it may look like over engineering but in real world instantiating taskstore will not be that simple. So  there this static method makes sense
    public static empty():TaskStore{
        return new TaskStore("Annonymous");
    }

}


