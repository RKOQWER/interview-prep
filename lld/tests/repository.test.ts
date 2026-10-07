import {expect, it , describe} from "vitest";
import { Repository } from "../src/repository";
describe("Repository",()=>{
    it("add item",()=>{
        const r=new Repository<number>();
        r.add(1,1);
        expect(r.getSize()).toBe(1);
    })
    it("find by id test",()=>{
        const r=new Repository<number>();
        r.add(1,1);
        expect(r.findById(1)).toBe(1);
    })
    it("list function test",()=>{
        const r=new Repository<number>();
        const items=r.list();
        expect(items.length).toBe(0);
    })
    it("get size test",()=>{
        const r=new Repository<number>();
        expect(r.getSize()).toBe(0);
    })
})