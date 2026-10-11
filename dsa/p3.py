# Given an integer array nums (n <= 10^5, unsorted) and integer k, return the kth largest element. Note: the kth largest in sorted order, not the kth distinct.

# Constraints: O(10**5)
# complexity : O(nlogn) or lower complexity will work.
# Patterns: Sort , heap
# Commit heap as it takes O(klogk) and k<=n
from typing import List
import heapq

def kthlargest(arr:List[int],k:int)->int:
    n=len(arr)
    min_heap=[]
    for i in range(k):
        heapq.heappush(min_heap,arr[i])
    for i in range(k,n):
        if arr[i]>min_heap[0]:
            heapq.heappop(min_heap)
            heapq.heappush(min_heap,arr[i])
    return min_heap[0]

if __name__=="__main__":
    arr=[1,2,3,4,5]
    k=3
    ans=kthlargest(arr,k)
    print(ans)
    
