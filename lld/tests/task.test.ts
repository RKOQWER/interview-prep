import {describe, expect, it} from "vitest";
import { Task } from "../src/task";
describe("Task",()=>{
    it("test getid",()=>{
        const t:Task=new Task(1,"One","todo");
        expect(t.getId()).toBe(1);
    })

    it("test get title",()=>{
        const t:Task=new Task(1,"One","todo");
        expect(t.getTitle()).toBe("One");
    })
    it("test get status",()=>{
        const t:Task=new Task(1,"One","todo");
        expect(t.getStatus()).toBe("todo");
    })

    it("test set status",()=>{
        const t:Task=new Task(1,"One","todo");
        t.setStatus("in_progress");
        expect(t.getStatus()).toBe("in_progress");
    })

    it("Cannot change id",()=>{
        const t:Task= new Task(1,"one","todo");

        // @ts-expect-error - no public id field or setter
        t.id=2;
    })
    it("Cannot change title",()=>{
        const t:Task= new Task(1,"one","todo");

        // @ts-expect-error - no public title field or setter
        t.title="two";
    })
})