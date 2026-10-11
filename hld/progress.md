# HLD Progress

Plan: 12-week track, 7-part treatment per system, 3 threads (classic / AI / under-the-hood + math).
Minimum 1 hour/day. Mastery gate: a shaky fundamental stays until redrawn from memory cold.

## Track position

- Phase: 1 of 3 (October - vocabulary + first system)
- Current: Week 1, Session 3 (Load balancing, CDN and DNS)
- Up next: System 1 (URL shortener) written end to end - sections 1, 3-7; estimation (section 2) already done.

## Sessions

| # | Session | Status | Notes |
|---|---------|--------|-------|
| 1 | Scaling: vertical vs horizontal, latency vs throughput | notes done | recall check pending |
| 2 | Back-of-envelope estimation | notes done | recall check pending |
| 3 | Load balancing, CDN and DNS | notes done | recall check pending |

## Trade-off log

- URL shortener: sizing first showed the system is storage-bound, not traffic-bound, so keys are 7 bytes and the read path is cached, while sharding stays off the critical path.
- URL shortener read path: CDN -> Redis -> app + Postgres, because estimation showed the system is read-dominated; writes (POST /links) skip the CDN since POSTs are never cached.
