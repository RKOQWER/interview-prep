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

// Build: extract a Repository<T> from TaskStore's array logic and store Tasks in it. Keep TaskStore tests green; add one test using a DIFFERENT T (e.g. Repository<number>) to prove reuse.

