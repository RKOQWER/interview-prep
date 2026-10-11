# There are numCourses courses (numCourses <= 2000) and prerequisites pairs [a, b] meaning "to take a you must first take b". Return true if you can finish all courses, else false. b->a

# Constraints: n<=2000 so total edges 2000C2 which is 10**8 approx

# complexity: O(n+e) should pass

# patterns: topological sort or backtracking

# Reason for a particular approach : topological sort as for backtracking complexity will be huge.
from collections import deque
from typing import List

def topo(edges:List[int,int],n:int)->bool:
    graph=[[] for _ in range(n)]
    in_degree=[0 for _ in range(n)]
    for v , u in edges:
        graph[u].append(v)
        in_degree[v]+=1
    queue=deque()
    ans=[]
    for i in range(n):
        if in_degree[i]==0:
            queue.append(i)
    while queue:
        u=queue.popleft()
        ans.append(u)
        for v in graph[u]:
            in_degree[v]-=1
            if in_degree[v]==0:
                queue.append(v)
    return len(ans)==n
    

