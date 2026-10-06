import {describe, expect ,it } from "vitest";
import { Greeter } from "../src/greeter";

describe("Greeter",()=>{
    it("describe by name",()=>{
        expect(new Greeter().greet("Rahul")).toBe("Hello Rahul");
    })

    it("empty name check",()=>{
        expect(new Greeter().greet("")).toBe("Hello ");
    })
})