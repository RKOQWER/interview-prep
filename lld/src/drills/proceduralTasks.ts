// Drill source - refactor this procedural script into 2-3 classes with protected invariants.
// Rules:
//  1. owner/title/id rules must not be breakable from outside
//  2. invalid transitions must throw
//  3. no public mutable fields

type TaskStatus = "todo" | "in_progress" | "done";

const tasks: Array<{ id: number; title: string; status: TaskStatus; owner: string }> = [];
let nextId = 1;

export function addTask(title: string, owner: string): number {
  if (title.trim() === "") return -1; // silent failure - bad
  const id = nextId++;
  tasks.push({ id, title, status: "todo", owner });
  return id;
}

export function startTask(id: number): boolean {
  const t = tasks.find((t) => t.id === id);
  if (!t) return false;
  t.status = "in_progress"; // no check on current status - any status allowed
  return true;
}

export function completeTask(id: number): boolean {
  const t = tasks.find((t) => t.id === id);
  if (!t) return false;
  t.status = "done"; // can jump todo -> done, skipping in_progress
  return true;
}

export function reassign(id: number, newOwner: string): boolean {
  const t = tasks.find((t) => t.id === id);
  if (!t) return false;
  if (newOwner === "") return false;
  t.owner = newOwner;
  return true;
}

export function allDone(): boolean {
  return tasks.length > 0 && tasks.every((t) => t.status === "done");
}
