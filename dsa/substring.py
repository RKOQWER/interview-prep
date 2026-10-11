# Here's the drill. For each problem, before any code, give me the 60-second scan:
# 1. Constraints -> allowed complexity
# 2. Keywords -> the ask, verbatim
# 3. Top-2 candidate patterns + one-line reason each
# 4. Commit to one
# Problem 1 - Longest Substring Without Repeating Characters
# Given a string s of length n, find the length of the longest substring with no duplicate characters.
# Constraints: n <= 5 * 10^4
# Example: s = "abcabcbb" -> 3 ("abc")

# Given a string s of length n, find the length of the longest substring with no duplicate characters.
# Constraints: n <= 5 * 10^4
# Example: s = "abcabcbb" -> 3 ("abc")

# Constraints : 5* 10**4 -> O(nlogm) solution or lower complexity solution will work

# longest substring + no duplicate -> two pointer with set (We discard freq array of charcaters as it may be digits etc)

def longest_string(s:str)->int:
    n=len(s)
    i=-1 # position of excluded end
    j=0 # included end
    st=set()
    max_len=0
    while j<n:
        if s[j] not in st:
            max_len=max(max_len,j-i)
            st.add(s[j])
            j+=1
            continue
        while s[j] in st:
            i+=1
            st.remove(s[i])
    return max_len

if __name__=="__main__":
    s="abcabcbb"
    ans=longest_string(s)
    print(ans)


