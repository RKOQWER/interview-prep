
export class NotFoundError extends Error{
    constructor(readonly resource:string, readonly id:number){
        super(`${resource} with id ${id} not found`);
        this.name="NotFoundError";
    }
}

export class InvalidStateError extends Error{
    constructor(message:string){
        super(message);
    }
}