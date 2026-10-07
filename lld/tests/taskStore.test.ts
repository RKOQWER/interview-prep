import {it , expect ,describe} from "vitest";
import { TaskStore } from "../src/taskStore";
import { Task } from "../src/task";
import { InvalidStateError,NotFoundError } from "../src/errors";

describe("Task Store testcases",()=>{
    it("add function",()=>{
        const ts:TaskStore=new TaskStore("hello");
        const t1:Task={id:1,title:"A",status:"todo"};
        ts.add(t1);
        expect(ts.getSize()).toBe(1);

    })
    it("id cannot be <=0",()=>{
        const ts:TaskStore=TaskStore.empty();
        const t1:Task={id:0,title:"Mock",status:"todo"};
        expect(()=>ts.add(t1)).toThrow(InvalidStateError);

    })
    it("empty title",()=>{
        const ts:TaskStore=TaskStore.empty();
        const t1:Task={id:1,title:"   ",status:"todo"};
        expect(()=>ts.add(t1)).toThrow(InvalidStateError);
    })
    it("findById test for valid id",()=>{
        const ts:TaskStore=new TaskStore("hello");
        const t1:Task={id:1,title:"A",status:"todo"};
        ts.add(t1);
        const t2:Task|undefined =ts.findById(1);
        expect(t2?.id).toBe(1);
        expect(t2?.title).toBe("A");
        expect(t2?.status).toBe("todo");
    })
    it("findbyId error",()=>{
        const ts=TaskStore.empty();
        expect(()=>ts.findById(1)).toThrow(NotFoundError);
    })
    it("test size function",()=>{
        const ts:TaskStore=TaskStore.empty();
        expect(ts.getSize()).toBe(0);
    })
    it("Test empty factory",()=>{
        const ts:TaskStore=TaskStore.empty();
        expect(ts.getSize()).toBe(0);
    })
})
