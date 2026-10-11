You're on the backend for a flash-sale marketplace. During a sale, order events arrive one at a time; each event carries a single integer, the order's value in cents (negative for refunds). The sale emits up to n = 10^5 events, in arbitrary order. Marketing's live dashboard shows "Whale Watch": the combined value of the K most expensive orders seen so far. K is small (K <= 20) and fixed before the stream starts.
The ingestion process is memory-constrained: you may hold only a bounded amount of state - you cannot buffer all n events to sort at the end, and there's no disk. You process events in a single pass.
You'll receive a sequence of operations:
- add x - an order of value x arrives
- top - emit the current Whale Watch total
Output the value of each top, in order.
Example (K = 2):
add 10
add 5
top      -> 15
add 40
top      -> 50
add -2
top      -> 50
add 8
top      -> 48
Return the list of top outputs