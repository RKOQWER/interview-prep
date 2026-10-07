
export class Repository<T>{
    private items = new Map<number,T>();
    public add(id:number,task:T):void{
        this.items.set(id,task);
    }

    public findById(id:number):T|undefined{
        const task:T|undefined=this.items.get(id);
        return task ;
    }

    public list():T[]{
        return [...this.items.values()]
    }

    public getSize():number{
        return this.items.size;
    }
}