# DSA Baseline - Oct 7, 2026

Goal: measure current pattern hit rate. 3 cold mediums, mixed topics, no hints.
For each problem, run the scan ritual before coding:
1. Constraints -> allowed complexity (n bound)
2. Keywords -> the ask, verbatim
3. Top-2 candidate patterns + one-line reason each
4. Commit to one

Score: first-choice pattern correct? Log mistakes in error-log.md.

---

## Problem 1 - Longest Substring Without Repeating Characters

Given a string `s` of length `n`, find the length of the longest substring with no duplicate characters.

Constraints: `n <= 5 * 10^4`

Example: `s = "abcabcbb"` -> `3` ("abc")

## Problem 2 - Course Schedule

There are `numCourses` courses (`numCourses <= 2000`) and `prerequisites` pairs `[a, b]` meaning "to take a you must first take b". Return `true` if you can finish all courses, else `false`.

## Problem 3 - Kth Largest Element in an Array

Given an integer array `nums` (`n <= 10^5`, unsorted) and integer `k`, return the kth largest element.

Note: the kth largest in sorted order, not the kth distinct.
