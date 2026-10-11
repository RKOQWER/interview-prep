# HLD Notes

## Week 1, Session 1 - Fundamentals: Scaling

- **Vertical scaling (scale up):** bigger machine. Simple, no code changes, no distributed complexity. But: hardware ceiling, cost grows superlinearly, single point of failure, migration means downtime.
- **Horizontal scaling (scale out):** more machines behind a load balancer. Unbounded in theory, but every problem becomes distributed: state, coordination, consistency, partial failure. Go horizontal with stateless services first.
- **Latency:** time per request. Track percentiles (p50, p99), not averages - averages hide the tail that users actually feel.
- **Throughput:** requests per second sustained. Trades off against latency: batching raises throughput but raises latency.
- **Crossover point:** start vertical until cost or availability story breaks (hardware ceiling, SPOF), then go horizontal - stateless services first, stateful stores last.

---

## Week 1, Session 2 - Fundamental: Back-of-envelope estimation

- **What it solves:** makes scale explicit before any component choice, and tells you which components are the critical path. At 100 QPS "a database server" is the whole architecture; at 100k QPS caching, load balancing and sharding dominate. It prevents both over-engineering and under-engineering. Wrong tool when: requirements are pre-prototype (the estimate is fiction anyway), or traffic is wildly skewed to hot keys - then measure, don't estimate more carefully.
- **Method (5 steps):** (1) pin the workload: DAU x actions per user per day; (2) QPS = DAU x actions / 86400, peak = 2-3x average; (3) read/write split per feature; (4) storage = record bytes x volume x replication factor (3x) x retention; (5) bandwidth = QPS x payload, servers = QPS / per-server RPS.
- **Numbers to know cold:** day = 10^5 s, month = 2.5 x 10^6 s, year = 3.15 x 10^7. Latency ladder: L1 0.5 ns, L2 7 ns, RAM 100 ns, SSD 4KB read ~100 us, disk seek 10 ms, DC round trip 500 us, cross-continent 150 ms.
- **Capacity rules of thumb:** web service + one DB query: 100-1k RPS per instance (~500), Redis GET 50-100k ops/s per node, Postgres ~1-10k writes/s per primary, 1 Gbps NIC = 125 MB/s. Read:write ratios: feeds ~100:1, chat ~1:1, ledgers/telemetry write-dominated.
- **The output is a decision, not a number.** URL shortener at 100M new links/month: 40 writes/s, 4k reads/s (peak 10k), ~3 TB in 5 years -> storage-bound, not traffic-bound, so the design invests in compact keys and read caching, not sharding.

### Session 2 design work: URL shortener estimation (System 1, section 2 of the 7-part treatment)

- **Assumptions (state them out loud):** 100M new short links/month, 100:1 read:write, links kept 5 years.
- **Writes:** 100M / 2.5 x 10^6 s = 40/s avg, ~100/s peak.
- **Reads:** 10B redirects/month / 2.5 x 10^6 s = 4k/s avg, 10-12k/s peak.
- **Storage:** ~500 B/record (7-char code, ~200 B URL, timestamps, owner, expiry, click count) x 6B rows = 3 TB, x 3 replicas = ~9 TB.
- **Bandwidth:** 301 response ~300 B, so 4k reads/s = ~4 MB/s. Trivial.
- **Cache:** power-law access - last 4 weeks of links (~25M/week) = ~12 GB hot set, fits on one Redis node.
- **Servers:** 10k peak / 500 RPS per instance = 20-30 stateless app boxes behind an LB; one Postgres primary absorbs 100 writes/s without noticing.
- **Decision this produces:** the system is storage-bound and read-dominated, not traffic-bound. Compact 7-byte keys matter, the read path is cached aggressively, sharding stays off the critical path for years. Skipping estimation is how you show up with Kafka and eight shards at 100 writes/s.

---

## Week 1, Session 3 - Fundamentals: Load balancing, CDN and DNS

- **Load balancing - what it solves:** spreads requests across machines - the piece that makes "go horizontal" (session 1) real. No single box is the bottleneck or SPOF, health checks eject dead nodes automatically, connection draining lets deploys roll without dropping requests. Without an LB, extra servers are just unused capacity.
- **L4 vs L7:** L4 (TCP) forwards by IP:port, blind to content - microseconds, pure distribution. L7 (HTTP) terminates TLS and routes by host/path/header (`/create` vs `/{code}`), enabling path routing and sticky sessions, at CPU cost per request. Rule: L4 when distribution is all you need; L7 when the route must see the request.
- **Algorithms:** round robin (uniform costs), least-connections (mixed costs), weighted (mixed hardware), consistent hashing (cache affinity, minimal reshuffle on scale-out - math corner 5), power of two choices (least-loaded of 2 random picks: near-optimal, O(1) state). Sticky sessions are a crutch - prefer stateless services with shared state in Redis/DB.
- **CDN - what it solves:** caches cacheable content at edge PoPs, turning the 150 ms cross-continent hop into ~ms and absorbing reads the origin never sees. Cache key = host + path + query; TTL + purge = invalidation. Wrong tool: personalized, dynamic, or rapidly-changing content - a collapsed hit rate means paying for the cache *and* the origin.
- **DNS - what it solves:** name to IP, the first hop of every request, and the coarsest routing layer (geo, weighted, failover). TTL trade-off: low = fast cutover but more lookups; high = snappy for users but stale during a change. Point DNS at a stable anycast LB address, not machine IPs. Wrong tool for all of it: traffic that fits one server - LB/CDN then add a hop, a cost, and a new failure domain.

### Session 3 design work: URL shortener read path (System 1, diagram pieces)

- **DNS:** `s.example.com` CNAME -> anycast LB IP. Boxes scale behind a stable address; DNS never lists machines.
- **LB:** L7 for the API tier (`POST /links` vs `GET /{code}`), 20-30 stateless boxes from session 2's sizing, least-connections. Health checks + draining make deploys invisible to users.
- **CDN:** the redirect itself (`GET /{code}` -> 301, ~300 B) is cacheable with a short TTL; hot links are served at the edge and never touch the origin. The write path (`POST /links`, 40-100/s) bypasses the CDN entirely - POSTs are never cached.
- **Result:** a 3-tier read path - CDN -> Redis (~12 GB hot set, session 2) -> app + Postgres. Origin traffic = misses only; a strong CDN hit rate makes the 10k peak a rounding error at the origin.
- **Decision:** no sticky sessions anywhere (stateless redirect service, session 1 rule). The only stateful hop is the DB write on link creation, at 40/s - far from any bottleneck.

---

## Math corner 1 - Little's Law and utilization

- **Little's Law: `L = λ · W`.** Items in system = throughput x time in system. Distribution-free and exact in steady state, not an approximation. Know any two, the third is forced: 1000 RPS at 100 ms = 100 requests in flight, which is your pool/thread/connection floor.
- **Utilization `ρ = λ / μ` (= λ · S).** Fraction of time a server is busy (0-1). `ρ < 1` is required for stability - at `ρ ≥ 1` any burst builds a queue that never drains.
- **Why high ρ hurts:** the idle fraction `(1 - ρ)` is the slack that absorbs bursts. M/M/1 response time `W = S / (1 - ρ)`: ρ=0.5 -> 2x service time, ρ=0.9 -> 10x, ρ=0.99 -> 100x. Target 50-70% utilization, never 100%.
- **Use it for:** sizing pools (inflight = QPS x latency), autoscaling thresholds (utilization-based), queue lag (lag = arrival rate x wait time).
- **Wrong tool when:** not in steady state (bursts, cold start, batch), multiple latency classes (cache hit vs miss), or closed-loop think-time systems where λ is an output not an input. Says nothing about the distribution shape - that is what percentiles are for.

---

## Math corner 2 - Percentiles and tail latency

- **Percentile = "X% of requests were at or below this value."** Sort the latencies and read off a position: p50 (median), p90, p99, p99.9. It describes the shape of the distribution, not just the center.
- **The average lies.** For `1,1,1,1,1,1,1,1,1,100` the average is 10.9 ms, but no user felt 10.9 ms: nine got 1 ms, one got 100 ms. A single mean blends fast and slow clusters into a number nobody experienced.
- **Real traffic is clustered:** most requests fast (cache hit / warm path), a minority slow (cache miss, GC pause, lock wait, retry). The slow minority is the tail. Watch p50 for the typical user, p99 for the unlucky one. SLOs are written `p99 < 200 ms`, never as an average.
- **Tail amplification (fan-out): `1 - (1 - p)^n`.** Each backend reaches its p99 (1% slow) 1 in 100 times, but a request waiting on the slowest of n=100 parallel backends hits a slow one `1 - 0.99^100 = 63%` of the time. Fan-out turns the tail into the norm: your p99 becomes the user's average. Fixes: hedged/tied requests, replication, cap fan-out.
- **Trap + limits:** never average percentiles across servers - merge raw histograms, then compute. Percentiles are overkill when the distribution is tight or for throughput-bound batch jobs, but mandatory for any user-facing, multi-service request.

---

## Math corner 3 - Capacity estimation models

- **Naive sizing `servers = peak_QPS / per_server_RPS` is wrong** - it assumes 100% utilization, zero failures, and traffic never exceeding peak. Every real capacity plan corrects all three.
- **Add a utilization target `ρ_max` (~0.6):** `servers = peak_QPS / (per_server_RPS × ρ_max)`. The `ρ_max` divisor is the latency safety margin, the slack that absorbs bursts. 10k / (500 x 0.6) = 34 boxes, not 20.
- **Add redundancy:** losing 1 of N servers raises each survivor's utilization by `N/(N-1)`, so size for the failed state to still respect `ρ_max` (N+1, N+2, or N + a zone).
- **SLO-driven sizing (the real math):** combine `W = S/(1-ρ)` with `ρ = λ/(n·μ)` and solve for servers: `n ≥ λ / (μ·(1 - S/W_target))`. A tighter latency target costs servers superlinearly (ρ 0.5 -> 0.9 needs ~2.5x the boxes) - SLOs are business decisions.
- **Time + other resources:** provision for peak (`peak = k·avg`, k ≈ 2-3), model growth (doubling = `ln2/ln(1+g)`), and reuse the same shape for storage/bandwidth/cache: `required = demand / (per-unit capacity × headroom)`. Wrong tool for pre-prototype guesses, hot-key skew, and non-Poisson bursts.
