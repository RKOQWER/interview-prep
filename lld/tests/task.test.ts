import {describe,it,expect} from "vitest";
import { Task,moveTask,assigneeName } from "../src/task";
describe("Task",()=>{
    it("Move a task without mutating orignal",()=>{
        const t1:Task= {id:1, title:"Task 1", status: "todo"}
        const t2=moveTask(t1,"done");
        expect(t2.status).toBe("done");
        expect(t1.status).toBe("todo");
    })
    it("Assigning a assignee name",()=>{
        const t1:Task={id:1,title:"Task1",status:"todo",assignee:{name:"Rahul"}};
        expect(assigneeName(t1)).toBe("Rahul");

    })
    it("Task with no assignee",()=>{
        const t1:Task={id:2,title:"Task 2",status:"done"};
        expect(assigneeName(t1)).toBe("unassigned");
    })
    it("Task id cannot be changed",()=>{
        const t1:Task={id:1,title:"Invariant1",status:"done"};
        // @ts-expect-error id is readonly
        t1.id=10;
    })
    it("Task name cannot be changed",()=>{
        const t1:Task={id:2,title:"Abc",status:"todo"};
        //@ts-expect-error 
        t1.name="Hello";
    })
})