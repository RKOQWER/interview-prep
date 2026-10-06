export class Greeter{
    public greet(name:string){
        return `Hello ${name}`;
    }
}

type Status = "todo" | "in_progress" | "done";

function labelFor(status:Status): string{
    switch(status){
        case "todo":
            return "not started";
        case "in_progress":
            return "Working";
        case "done":
            return "Completed";
    }
}