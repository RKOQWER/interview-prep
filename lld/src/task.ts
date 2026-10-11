export type Status="todo" | "in_progress" | "done";

export class Task{
    #id:number;
    #title:string;
    #status:Status;
    public assignee?:{name:string};
    public dueDate?:string;
    constructor(id:number,title:string,status:Status){
        this.#id=id;
        this.#title=title;
        this.#status=status;
    }
    public getId():number{
        return this.#id;
    }

    public getTitle():string{
        return this.#title;
    }

    public getStatus():Status{
        return this.#status;
    }

    public setStatus(newStatus:Status):void{
        this.#status=newStatus;
    }
}

