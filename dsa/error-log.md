# DSA Error Log

| Date | Problem | Mistake class (A/B/C/D/E) | Signal missed | Redo date |
|------|---------|---------------------------|---------------|-----------|
| Oct 11 | Longest Substring | D | Stated O(n log m); target is O(n)/O(min(n,alphabet)) | Oct 18 |
| Oct 11 | Course Schedule | D + E | 2000C2 ~ 2e6 not 1e8; `List[int,int]` unimported would crash at def | Oct 18 |
| Oct 11 | Kth Largest | E | Size-k min-heap invariant inverted (`<` vs `>`); heappush arg missing | Oct 18 |
